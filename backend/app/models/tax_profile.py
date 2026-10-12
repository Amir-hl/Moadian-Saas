from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class TaxProfile(Base):
    __tablename__ = "tax_profiles"

    __table_args__ = (
        UniqueConstraint(
            "organization_id",
            name="uq_tax_profiles_organization_id",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    organization_id: Mapped[int] = mapped_column(
        ForeignKey("organizations.id", ondelete="RESTRICT"),
        nullable=False,
    )

    # Company information
    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    legal_name: Mapped[str] = mapped_column(
        String(250),
        nullable=False,
    )

    taxpayer_type: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    national_id: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    registration_number: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    economic_code: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    postal_code: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    address: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    phone: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    # Moadian configuration
    tax_memory_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
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

    organization = relationship(
        "Organization",
        back_populates="tax_profile",
    )