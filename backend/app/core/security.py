import base64
import hashlib
from cryptography.fernet import Fernet
from app.core.config import get_settings


def _get_fernet_key(secret: str) -> bytes:
    """Derive a valid 32-byte URL-safe base64 key for Fernet from any secret string."""
    digest = hashlib.sha256(secret.encode("utf-8")).digest()
    return base64.urlsafe_b64encode(digest)


def get_cipher() -> Fernet:
    settings = get_settings()
    key = _get_fernet_key(settings.moadian_encryption_key)
    return Fernet(key)


def encrypt_secret(plain_text: str | None) -> str | None:
    """Encrypt a sensitive string (e.g. private key PEM) for storage in DB."""
    if not plain_text:
        return None
    cipher = get_cipher()
    encrypted_bytes = cipher.encrypt(plain_text.strip().encode("utf-8"))
    return encrypted_bytes.decode("utf-8")


def decrypt_secret(cipher_text: str | None) -> str | None:
    """Decrypt a sensitive string retrieved from DB."""
    if not cipher_text:
        return None
    cipher = get_cipher()
    decrypted_bytes = cipher.decrypt(cipher_text.strip().encode("utf-8"))
    return decrypted_bytes.decode("utf-8")
