from collections.abc import Generator
from fastapi import HTTPException, status
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import get_settings


settings = get_settings()


class Base(DeclarativeBase):
    """Base class for all database models."""
    pass


engine = None
SessionLocal = None

# If database_url is provided, create the engine. Otherwise fallback to local sqlite for dev if desired.
db_url = settings.database_url
if db_url:
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
    )
    SessionLocal = sessionmaker(
        bind=engine,
        autoflush=False,
        autocommit=False,
    )


def get_db() -> Generator[Session, None, None]:
    """Dependency that yields a database session for requests."""
    if SessionLocal is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="اتصال به پایگاه داده تنظیم نشده است (DATABASE_URL تنظیم نیست).",
        )
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
