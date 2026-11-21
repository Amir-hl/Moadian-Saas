from __future__ import annotations

import logging
from datetime import datetime, timezone
from decimal import Decimal
from typing import Any

from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import decrypt_secret
from app.models.invoice import Invoice
from app.models.invoice_submission import InvoiceSubmission
from app.models.moadian_settings import MoadianSettings
from app.services.tax_id_service import tax_id_service

from tax_collect_data.config import TaxSdkOptions
from tax_collect_data.exceptions import TaxApiError
from tax_collect_data.models import (
    BodyItemDto,
    HeaderDto,
    InvoiceDto,
    InvoiceResponseDto,
    InvoiceStatusDto,
)
from tax_collect_data.sdk import TaxSdk

logger = logging.getLogger(__name__)


class MoadianServiceError(Exception):
    """Base exception for Moadian service operations."""
    pass


class MoadianService:
    def __init__(self) -> None:
        self.settings = get_settings()

    def get_sdk_for_organization(self, organization_id: int, db: Session) -> tuple[TaxSdk, MoadianSettings]:
        """
        Build and configure a TaxSdk client instance for a given organization.
        Decrypts credentials in-memory without saving private keys to disk.
        """
        stmt = select(MoadianSettings).where(
            MoadianSettings.organization_id == organization_id,
            MoadianSettings.is_active == True,
        )
        settings_row = db.execute(stmt).scalars().first()

        if not settings_row:
            raise MoadianServiceError(
                f"تنظیمات سامانه مودیان برای سازمان شناسه {organization_id} یافت نشد یا غیرفعال است."
            )

        if not settings_row.client_id:
            raise MoadianServiceError("شناسه یکتای حافظه مالیاتی (Client ID) ثبت نشده است.")

        if not settings_row.private_key_encrypted:
            raise MoadianServiceError("کلید خصوصی سامانه مودیان تنظیم نشده است.")

        private_key = decrypt_secret(settings_row.private_key_encrypted)
        certificate = decrypt_secret(settings_row.certificate_encrypted)
        password = decrypt_secret(settings_row.private_key_password_encrypted)

        options = TaxSdkOptions(
            base_url=self.settings.moadian_api_base_url,
            client_id=settings_row.client_id.strip(),
            private_key=private_key,
            certificate=certificate,
            private_key_password=password,
            api_version=self.settings.moadian_api_version,
            request_timeout=self.settings.moadian_request_timeout,
        )

        try:
            sdk = TaxSdk.configure(options)
            return sdk, settings_row
        except Exception as e:
            logger.error("Error configuring TaxSdk for org %s: %s", organization_id, e)
            raise MoadianServiceError(f"خطا در پیکربندی ارتباط با سامانه مودیان: {e}") from e

    def build_invoice_dto(self, invoice: Invoice, client_id: str) -> InvoiceDto:
        """
        Map a database Invoice entity to the TaxSdk's InvoiceDto format.
        """
        # Ensure tax_id is generated
        if not invoice.tax_id:
            serial = invoice.moadian_serial or invoice.id
            invoice.tax_id = tax_id_service.generate(
                client_id=client_id,
                serial=serial,
                issue_date=invoice.issue_date,
            )

        # Calculate timestamp in ms
        issue_dt = datetime.combine(invoice.issue_date, datetime.min.time(), tzinfo=timezone.utc)
        indatim_ms = int(issue_dt.timestamp() * 1000)

        # Mapping invoice type (1: First type with buyer info, 2: Second type / simplified)
        inty = 1
        if invoice.invoice_type == "type2":
            inty = 2
        elif invoice.invoice_type == "type3":
            inty = 3

        # Seller Tax ID / Economic Code
        tins = (
            invoice.seller_economic_code_snapshot
            or (invoice.tax_profile.economic_code if invoice.tax_profile else None)
            or (invoice.tax_profile.national_id if invoice.tax_profile else None)
        )

        # Buyer info
        tinb = invoice.customer_economic_code_snapshot or invoice.customer_national_id_snapshot
        bid = invoice.customer_national_id_snapshot

        header = HeaderDto(
            taxid=invoice.tax_id,
            indatim=indatim_ms,
            ins=1,  # 1: اصلی (Original invoice)
            inty=inty,
            inp=1,  # 1: الگوی اول فروش (Standard sale pattern)
            inno=invoice.invoice_number,
            tins=tins,
            tinb=tinb if inty == 1 else None,
            bid=bid if inty == 2 else None,
            tprdis=int(invoice.subtotal),
            tdis=int(invoice.discount_amount),
            tadis=int(invoice.subtotal - invoice.discount_amount),
            tvam=int(invoice.tax_amount),
            todam=0,
            tbill=int(invoice.total_amount),
            setm=1,  # 1: نقدی (Cash)
        )

        # Build line items
        body_items: list[BodyItemDto] = []
        for item in invoice.items:
            sstid = (
                (item.product.tax_product_id if item.product and item.product.tax_product_id else None)
                or item.product_code_snapshot
                or "2720000119339"  # Fallback default code if not set
            )
            
            qty = item.quantity or Decimal("1")
            unit_price = item.unit_price or Decimal("0")
            gross = qty * unit_price
            discount = item.discount_amount or Decimal("0")
            taxable = gross - discount
            tax_rate = item.tax_rate or Decimal("0")
            tax_amt = item.tax_amount or Decimal("0")
            total_item = taxable + tax_amt

            body_items.append(
                BodyItemDto(
                    sstid=sstid,
                    sstt=item.product_name_snapshot,
                    mu=item.unit_snapshot or "164",  # 164 is standard "عدد" in Moadian units
                    am=qty,
                    fee=unit_price,
                    prdis=int(gross),
                    dis=int(discount),
                    adis=int(taxable),
                    vra=tax_rate,
                    vam=int(tax_amt),
                    tsstam=int(total_item),
                )
            )

        return InvoiceDto(Header=header, Body=body_items)

    async def submit_invoice(self, invoice_id: int, db: Session) -> InvoiceSubmission:
        """
        Submit a single invoice to the Moadian tax system and record the submission attempt.
        """
        invoice = db.get(Invoice, invoice_id)
        if not invoice:
            raise MoadianServiceError(f"فاکتور با شناسه {invoice_id} یافت نشد.")

        sdk, moadian_settings = self.get_sdk_for_organization(invoice.organization_id, db)

        # Get next attempt number
        attempt_stmt = select(func.coalesce(func.max(InvoiceSubmission.attempt_number), 0)).where(
            InvoiceSubmission.invoice_id == invoice.id
        )
        max_attempt = db.execute(attempt_stmt).scalar() or 0
        attempt_number = max_attempt + 1

        submission = InvoiceSubmission(
            invoice_id=invoice.id,
            attempt_number=attempt_number,
            status="processing",
            submitted_at=datetime.now(timezone.utc),
        )
        db.add(submission)
        db.flush()

        try:
            invoice_dto = self.build_invoice_dto(invoice, moadian_settings.client_id)
            submission.tax_invoice_id = invoice_dto.Header.taxid

            # Send to tax system
            responses: list[InvoiceResponseDto] = await sdk.send_invoices([invoice_dto])
            
            if not responses:
                raise MoadianServiceError("پاسخی از سامانه مودیان دریافت نشد.")

            resp = responses[0]
            submission.tracking_id = resp.ReferenceNumber or resp.Uid
            submission.status = "success"
            submission.completed_at = datetime.now(timezone.utc)
            submission.response_payload = resp.model_dump(by_alias=True)

            # Update invoice record
            invoice.moadian_uid = resp.Uid
            invoice.moadian_reference_number = resp.ReferenceNumber
            invoice.status = "submitted"

            db.commit()
            db.refresh(submission)
            return submission

        except Exception as exc:
            db.rollback()
            logger.exception("Failed to submit invoice %s to Moadian", invoice_id)
            
            submission.status = "failed"
            submission.completed_at = datetime.now(timezone.utc)
            submission.error_message = str(exc)
            if isinstance(exc, TaxApiError):
                submission.error_code = "TAX_API_ERROR"
            else:
                submission.error_code = type(exc).__name__

            invoice.status = "failed"
            db.add(submission)
            db.commit()
            db.refresh(submission)
            return submission

    async def inquire_invoice_status(self, invoice_id: int, db: Session) -> list[InvoiceStatusDto]:
        """
        Inquire the status of a submitted invoice from Moadian.
        """
        invoice = db.get(Invoice, invoice_id)
        if not invoice:
            raise MoadianServiceError(f"فاکتور با شناسه {invoice_id} یافت نشد.")

        if not invoice.tax_id:
            raise MoadianServiceError("این فاکتور فاقد شناسه مالیاتی (Tax ID) است.")

        sdk, _ = self.get_sdk_for_organization(invoice.organization_id, db)
        
        statuses = await sdk.get_invoice_status([invoice.tax_id])
        if statuses:
            first_status = statuses[0]
            if first_status.Status in ("SUCCESS", "CONFIRMED", "APPROVED"):
                invoice.status = "approved"
            elif first_status.Status in ("FAILED", "REJECTED"):
                invoice.status = "rejected"
            db.commit()

        return statuses

    async def test_organization_connection(self, organization_id: int, db: Session) -> dict[str, Any]:
        """
        Test Moadian connection and certificate validity for an organization.
        """
        sdk, moadian_settings = self.get_sdk_for_organization(organization_id, db)
        
        if sdk._v1 is not None:
            server_info = await sdk.v1.get_server_information()
            token = await sdk.v1.request_token()
            return {
                "status": "connected",
                "api_version": "v1",
                "client_id": moadian_settings.client_id,
                "server_time": server_info.ServerTime,
                "token_expires_in": token.expires_in,
            }
        else:
            server_info = await sdk.v2.get_server_information()
            return {
                "status": "connected",
                "api_version": "v2",
                "client_id": moadian_settings.client_id,
                "server_time": getattr(server_info, "server_time", None),
            }


moadian_service = MoadianService()
