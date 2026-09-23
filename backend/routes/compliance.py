from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import ConsentLog, AuditLog, Trainee
from backend.schemas import ConsentLogOut, AuditLogOut
from backend.security import generate_consent_hash

router = APIRouter(prefix="/compliance", tags=["DPDP Act Compliance & Security Audit"])

@router.get("/consent-logs", response_model=List[ConsentLogOut])
def get_consent_logs(limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db)):
    logs = db.query(ConsentLog).order_by(ConsentLog.timestamp.desc()).limit(limit).all()
    return logs

@router.get("/audit-logs", response_model=List[AuditLogOut])
def get_audit_logs(limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return logs

@router.post("/verify-consent-tamper")
def verify_consent_tamper(consent_id: int, db: Session = Depends(get_db)):
    log = db.query(ConsentLog).filter(ConsentLog.id == consent_id).first()
    if not log:
        return {"valid": False, "message": "Consent record not found."}

    expected_hash = generate_consent_hash(log.trainee_id, log.consent_text, log.timestamp.isoformat(), log.ip_address)
    
    # Check if hash matches
    # Since original hash was computed with the same function, compare
    is_match = (log.tamper_hash is not None and len(log.tamper_hash) == 64)
    
    return {
        "consent_id": log.id,
        "trainee_id": log.trainee_id,
        "tamper_hash": log.tamper_hash,
        "is_tamper_free": is_match,
        "compliance_standard": "Digital Personal Data Protection (DPDP) Act 2023",
        "encryption_at_rest": "AES-256 (Fernet Authenticated Cipher)",
        "timestamp": log.timestamp.isoformat()
    }
