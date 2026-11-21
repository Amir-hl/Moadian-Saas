from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import encrypt_secret
from app.models.invoice import Invoice
from app.models.invoice_submission import InvoiceSubmission
from app.models.moadian_settings import MoadianSettings
from app.schemas.moadian import (
    ConnectionTestResponse,
    InvoiceSubmitResponse,
    MoadianSettingsPayload,
    MoadianSettingsResponse,
    SubmissionHistoryItem,
)
from app.services.moadian_service import MoadianServiceError, moadian_service

router = APIRouter(prefix="/moadian", tags=["Moadian Tax Integration"])


@router.get(
    "/organizations/{organization_id}/settings",
    response_model=MoadianSettingsResponse,
    summary="دریافت وضعیت تنظیمات سامانه مودیان سازمان",
)
def get_moadian_settings(
    organization_id: int,
    db: Session = Depends(get_db),
) -> Any:
    stmt = select(MoadianSettings).where(MoadianSettings.organization_id == organization_id)
    settings = db.execute(stmt).scalars().first()

    if not settings:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="تنظیمات مودیان برای این سازمان یافت نشد.",
        )

    return MoadianSettingsResponse(
        id=settings.id,
        organization_id=settings.organization_id,
        client_id=settings.client_id,
        has_private_key=bool(settings.private_key_encrypted),
        has_certificate=bool(settings.certificate_encrypted),
        is_active=settings.is_active,
        created_at=settings.created_at,
        updated_at=settings.updated_at,
    )


@router.post(
    "/organizations/{organization_id}/settings",
    response_model=MoadianSettingsResponse,
    summary="ثبت یا ویرایش تنظیمات و کلیدهای سامانه مودیان",
)
def save_moadian_settings(
    organization_id: int,
    payload: MoadianSettingsPayload,
    db: Session = Depends(get_db),
) -> Any:
    stmt = select(MoadianSettings).where(MoadianSettings.organization_id == organization_id)
    settings = db.execute(stmt).scalars().first()

    if not settings:
        settings = MoadianSettings(organization_id=organization_id)
        db.add(settings)

    settings.client_id = payload.client_id.strip()
    settings.private_key_encrypted = encrypt_secret(payload.private_key_pem)
    settings.certificate_encrypted = encrypt_secret(payload.certificate_pem)
    settings.private_key_password_encrypted = encrypt_secret(payload.private_key_password)
    settings.is_active = payload.is_active

    db.commit()
    db.refresh(settings)

    return MoadianSettingsResponse(
        id=settings.id,
        organization_id=settings.organization_id,
        client_id=settings.client_id,
        has_private_key=bool(settings.private_key_encrypted),
        has_certificate=bool(settings.certificate_encrypted),
        is_active=settings.is_active,
        created_at=settings.created_at,
        updated_at=settings.updated_at,
    )


@router.post(
    "/organizations/{organization_id}/test-connection",
    response_model=ConnectionTestResponse,
    summary="تست اتصال و بررسی کلیدها با سرور سامانه مودیان",
)
async def test_connection(
    organization_id: int,
    db: Session = Depends(get_db),
) -> Any:
    try:
        result = await moadian_service.test_organization_connection(organization_id, db)
        return ConnectionTestResponse(
            status="success",
            api_version=result["api_version"],
            client_id=result["client_id"],
            server_time=result.get("server_time"),
            token_expires_in=result.get("token_expires_in"),
            message="اتصال به سرور مودیان با موفقیت برقرار شد و کلیدها معتبر هستند.",
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"برقراری ارتباط با سامانه مودیان ناموفق بود: {exc}",
        )


@router.post(
    "/invoices/{invoice_id}/submit",
    response_model=InvoiceSubmitResponse,
    summary="ارسال فاکتور به سامانه مودیان",
)
async def submit_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
) -> Any:
    try:
        submission = await moadian_service.submit_invoice(invoice_id, db)
        
        if submission.status == "success":
            return InvoiceSubmitResponse(
                submission_id=submission.id,
                status=submission.status,
                tracking_id=submission.tracking_id,
                tax_invoice_id=submission.tax_invoice_id,
                message="فاکتور با موفقیت به سامانه مودیان ارسال شد.",
            )
        else:
            return InvoiceSubmitResponse(
                submission_id=submission.id,
                status=submission.status,
                tracking_id=submission.tracking_id,
                tax_invoice_id=submission.tax_invoice_id,
                error_code=submission.error_code,
                error_message=submission.error_message,
                message="ارسال فاکتور با خطا مواجه شد. جزئیات در تاریخچه ثبت شده است.",
            )
    except MoadianServiceError as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(err),
        )


@router.get(
    "/invoices/{invoice_id}/inquire",
    summary="استعلام وضعیت فاکتور ارسال شده از سامانه مودیان",
)
async def inquire_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
) -> Any:
    try:
        statuses = await moadian_service.inquire_invoice_status(invoice_id, db)
        return {
            "invoice_id": invoice_id,
            "count": len(statuses),
            "results": [s.model_dump(by_alias=True) for s in statuses],
        }
    except MoadianServiceError as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(err),
        )


@router.get(
    "/invoices/{invoice_id}/submissions",
    response_model=list[SubmissionHistoryItem],
    summary="دریافت تاریخچه تلاش‌های ارسال فاکتور به سامانه مودیان",
)
def get_invoice_submissions(
    invoice_id: int,
    db: Session = Depends(get_db),
) -> Any:
    stmt = (
        select(InvoiceSubmission)
        .where(InvoiceSubmission.invoice_id == invoice_id)
        .order_by(InvoiceSubmission.attempt_number.desc())
    )
    results = db.execute(stmt).scalars().all()

    return [
        SubmissionHistoryItem(
            id=item.id,
            attempt_number=item.attempt_number,
            status=item.status,
            tracking_id=item.tracking_id,
            tax_invoice_id=item.tax_invoice_id,
            error_code=item.error_code,
            error_message=item.error_message,
            submitted_at=item.submitted_at,
            completed_at=item.completed_at,
            response_payload=item.response_payload,
        )
        for item in results
    ]
