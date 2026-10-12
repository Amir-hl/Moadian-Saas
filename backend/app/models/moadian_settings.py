from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class MoadianSettings(Base):
    __tablename__ = "moadian_settings"

    __table_args__ = (
        UniqueConstraint(
            "organization_id",
            name="uq_moadian_settings_organization_id",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    organization_id: Mapped[int] = mapped_column(
        ForeignKey("organizations.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    # Moadian fiscal memory ID.
    # Passed to MoadianClient as client_id.
    client_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    # Encrypted PEM contents, not filesystem paths.
    private_key_encrypted: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    certificate_encrypted: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Decrypt this value and convert to bytes if required by the SDK.
    private_key_password_encrypted: Mapped[str | None] = mapped_column(
        Text,
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

    organization = relationship("Organization")