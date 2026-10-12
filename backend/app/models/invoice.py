from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Invoice(Base):
    __tablename__ = "invoices"

    __table_args__ = (
        UniqueConstraint(
            "organization_id",
            "invoice_number",
            name="uq_invoices_organization_number",
        ),
        Index(
            "ix_invoices_organization_issue_date",
            "organization_id",
            "issue_date",
        ),
        Index(
            "ix_invoices_organization_status",
            "organization_id",
            "status",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    organization_id: Mapped[int] = mapped_column(
        ForeignKey("organizations.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    customer_id: Mapped[int] = mapped_column(
        ForeignKey("customers.id", ondelete="RESTRICT"),
        nullable=False,
    )

    tax_profile_id: Mapped[int | None] = mapped_column(
        ForeignKey("tax_profiles.id", ondelete="RESTRICT"),
        nullable=True,
    )

    invoice_number: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    # Identifiers returned by the Moadian SDK
    moadian_uid: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    tax_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    moadian_reference_number: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    moadian_serial: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    invoice_type: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="normal",
    )

    issue_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="draft",
        index=True,
    )

    # Seller information snapshot
    seller_name_snapshot: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    seller_economic_code_snapshot: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    seller_tax_memory_id_snapshot: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    # Customer information snapshot
    customer_name_snapshot: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    customer_economic_code_snapshot: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    customer_national_id_snapshot: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    customer_address_snapshot: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    customer_phone_snapshot: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    # Financial totals
    subtotal: Mapped[Decimal] = mapped_column(
        Numeric(20, 4),
        nullable=False,
        default=Decimal("0"),
    )

    discount_amount: Mapped[Decimal] = mapped_column(
        Numeric(20, 4),
        nullable=False,
        default=Decimal("0"),
    )

    tax_amount: Mapped[Decimal] = mapped_column(
        Numeric(20, 4),
        nullable=False,
        default=Decimal("0"),
    )

    total_amount: Mapped[Decimal] = mapped_column(
        Numeric(20, 4),
        nullable=False,
        default=Decimal("0"),
    )

    description: Mapped[str | None] = mapped_column(
        String(1000),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    organization = relationship("Organization")
    customer = relationship("Customer")
    tax_profile = relationship("TaxProfile")

    items = relationship(
        "InvoiceItem",
        back_populates="invoice",
        cascade="all, delete-orphan",
        order_by="InvoiceItem.id",
    )