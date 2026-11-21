import sys
from pathlib import Path

# Ensure backend root is on sys.path
backend_root = Path(__file__).resolve().parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from datetime import date
from decimal import Decimal

from app.core.security import encrypt_secret, decrypt_secret
from app.models.invoice import Invoice
from app.models.invoice_item import InvoiceItem
from app.services.moadian_service import moadian_service
from app.services.tax_id_service import tax_id_service


def test_encryption_decryption():
    test_key = "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0...\n-----END RSA PRIVATE KEY-----"
    encrypted = encrypt_secret(test_key)
    assert encrypted is not None
    assert encrypted != test_key

    decrypted = decrypt_secret(encrypted)
    assert decrypted == test_key


def test_tax_id_generation():
    client_id = "A1122B"
    serial = 105
    issue_date = date(2026, 11, 20)

    tax_id = tax_id_service.generate(client_id, serial, issue_date)
    assert len(tax_id) == 22
    assert tax_id.startswith(client_id)


def test_invoice_dto_builder():
    client_id = "A1122B"
    invoice = Invoice(
        id=1,
        organization_id=1,
        customer_id=1,
        invoice_number="INV-2026-001",
        moadian_serial=1,
        invoice_type="type1",
        issue_date=date(2026, 11, 20),
        seller_economic_code_snapshot="14001234567",
        customer_economic_code_snapshot="14009876543",
        customer_national_id_snapshot="0012345678",
        subtotal=Decimal("1000000"),
        discount_amount=Decimal("100000"),
        tax_amount=Decimal("90000"),
        total_amount=Decimal("990000"),
    )

    item1 = InvoiceItem(
        id=1,
        invoice_id=1,
        product_code_snapshot="PRD-01",
        product_name_snapshot="محصول تستی شماره یک",
        unit_snapshot="164",
        quantity=Decimal("2"),
        unit_price=Decimal("500000"),
        discount_amount=Decimal("100000"),
        tax_rate=Decimal("10.00"),
        tax_amount=Decimal("90000"),
        line_total=Decimal("990000"),
    )
    invoice.items = [item1]

    dto = moadian_service.build_invoice_dto(invoice, client_id)

    assert dto.Header.taxid is not None
    assert len(dto.Header.taxid) == 22
    assert dto.Header.tins == "14001234567"
    assert dto.Header.tinb == "14009876543"
    assert dto.Header.tprdis == 1000000
    assert dto.Header.tdis == 100000
    assert dto.Header.tadis == 900000
    assert dto.Header.tvam == 90000
    assert dto.Header.tbill == 990000

    assert len(dto.Body) == 1
    assert dto.Body[0].sstt == "محصول تستی شماره یک"
    assert dto.Body[0].am == Decimal("2")
    assert dto.Body[0].prdis == 1000000
    assert dto.Body[0].dis == 100000
    assert dto.Body[0].adis == 900000
    assert dto.Body[0].vam == 90000
    assert dto.Body[0].tsstam == 990000


if __name__ == "__main__":
    test_encryption_decryption()
    test_tax_id_generation()
    test_invoice_dto_builder()
    print("All integration tests passed successfully!")
