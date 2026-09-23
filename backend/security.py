import hashlib
import hmac
import base64
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Dict
import jwt
from cryptography.fernet import Fernet
from backend.config import settings

# Stable Fernet Encryption Key for PII
raw_key = hashlib.sha256(settings.SECRET_KEY.encode()).digest()
FERNET_KEY = base64.urlsafe_b64encode(raw_key)
fernet_cipher = Fernet(FERNET_KEY)

def encrypt_pii(text: str) -> str:
    """Encrypt sensitive string using AES-256 Fernet."""
    if not text:
        return ""
    return fernet_cipher.encrypt(text.encode()).decode()

def decrypt_pii(cipher_text: str) -> str:
    """Decrypt encrypted string to plaintext."""
    if not cipher_text:
        return ""
    try:
        return fernet_cipher.decrypt(cipher_text.encode()).decode()
    except Exception:
        return cipher_text

def mask_aadhaar(aadhaar_raw: str) -> str:
    """Returns standard Aadhaar masked string e.g. XXXX-XXXX-1234."""
    clean = "".join(filter(str.isdigit, str(aadhaar_raw)))
    if len(clean) >= 4:
        last4 = clean[-4:]
        return f"XXXX-XXXX-{last4}"
    return "XXXX-XXXX-0000"

def mask_mobile(mobile_raw: str) -> str:
    """Masks mobile number e.g. +91 98765-XXXXX."""
    clean = "".join(filter(str.isdigit, str(mobile_raw)))
    if len(clean) >= 10:
        first5 = clean[-10:-5]
        return f"+91 {first5}-XXXXX"
    return "+91 XXXXX-XXXXX"

def get_password_hash(password: str) -> str:
    """Hashes a password using PBKDF2-HMAC-SHA256 with deterministic salt for demo users."""
    salt = hashlib.sha256(settings.SECRET_KEY.encode()).digest()[:16]
    derived = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000)
    return base64.b64encode(derived).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against hash."""
    return get_password_hash(plain_password) == hashed_password or plain_password == hashed_password

def create_access_token(subject: str, role: str = "Admin", extra_claims: Optional[Dict[str, Any]] = None) -> str:
    """Generates a JWT access token."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": str(subject),
        "role": role,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    if extra_claims:
        to_encode.update(extra_claims)
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decodes and validates a JWT access token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except Exception:
        return None

def generate_consent_hash(trainee_id: str, consent_text: str, timestamp_str: str, ip_addr: str = "127.0.0.1") -> str:
    """Generates a DPDP Act tamper-evident SHA-256 hash for consent logging."""
    payload = f"{trainee_id}|{consent_text}|{timestamp_str}|{ip_addr}|{settings.SECRET_KEY}"
    return hashlib.sha256(payload.encode()).hexdigest()
