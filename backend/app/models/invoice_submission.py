from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Index,
    Integer,
    JSON,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class InvoiceSubmission(Base):
    __tablename__ = "invoice_submissions"

    __table_args__ = (
        UniqueConstraint(
            "invoice_id",
            "attempt_number",
            name="uq_invoice_submissions_attempt",
        ),
        Index(
            "ix_invoice_submissions_invoice_created",
            "invoice_id",
            "created_at",
        ),
        Index(
            "ix_invoice_submissions_status",
            "status",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    invoice_id: Mapped[int] = mapped_column(
        ForeignKey("invoices.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    attempt_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    # processing, success, failed, unknown
    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="processing",
    )

    # Tracking identifiers returned by the service
    tracking_id: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    tax_invoice_id: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    error_code: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    error_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Sanitized response data only; never store private keys or credentials here.
    response_payload: Mapped[dict | list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    submitted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    invoice = relationship(
        "Invoice",
        backref="submissions",
    )