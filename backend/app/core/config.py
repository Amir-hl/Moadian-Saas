from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Moadian SaaS API"
    app_version: str = "0.1.0"
    environment: str = "development"
    debug: bool = True

    # Database
    database_url: str | None = None

    # Moadian Tax System Integration
    moadian_api_base_url: str = "https://tp.tax.gov.ir/req/api"
    moadian_api_version: str = "v1"
    moadian_request_timeout: float = 60.0

    # Master encryption key for tenant private keys at rest (Fernet URL-safe base64 32-byte key)
    # Generate in production via: Fernet.generate_key().decode()
    moadian_encryption_key: str = "aHR0cHM6Ly9naXRodWIuY29tL0FtaXItaGwvTW9hZGlhbi1TYWFzMTIz="

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
