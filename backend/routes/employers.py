import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Employer, SelfEmploymentRecord, AuditLog
from backend.schemas import EmployerCreate, EmployerOut, EmployerVerify, SelfEmploymentCreate, SelfEmploymentOut
from backend.blockchain import blockchain_service

router = APIRouter(prefix="/employers", tags=["Employer & Self-Employment Validation"])

@router.get("", response_model=List[EmployerOut])
def get_employers(status_filter: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Employer)
    if status_filter and status_filter != "All":
        query = query.filter(Employer.verification_status == status_filter)
    return query.order_by(Employer.created_at.desc()).all()

@router.post("", response_model=EmployerOut)
def register_employer(payload: EmployerCreate, db: Session = Depends(get_db)):
    # Record initial transaction on blockchain ledger
    tx_hash = blockchain_service.record_employer_verification(
        employer_name=payload.company_name,
        gst=payload.gst_number or "UNVERIFIED_GST",
        proof_file=payload.placement_proof_file or "offer_letter.pdf",
        verified_by="Pending Admin Verification"
    )

    now_dt = datetime.datetime.now(datetime.timezone.utc)
    new_emp = Employer(
        company_name=payload.company_name,
        industry_sector=payload.industry_sector,
        gst_number=payload.gst_number,
        udyam_number=payload.udyam_number,
        contact_person=payload.contact_person,
        contact_email=payload.contact_email,
        contact_phone=payload.contact_phone,
        district=payload.district,
        verification_status="Pending",
        placement_proof_file=payload.placement_proof_file,
        blockchain_tx_hash=tx_hash,
        active_hires_count=0,
        created_at=now_dt
    )
    db.add(new_emp)

    audit = AuditLog(
        user_identity=payload.contact_email,
        role="Employer",
        action="REGISTER_EMPLOYER",
        entity_type="Employer",
        entity_id=payload.company_name,
        details=f"Registered employer '{payload.company_name}' with GST: {payload.gst_number}",
        ip_address="127.0.0.1",
        timestamp=now_dt
    )
    db.add(audit)
    db.commit()
    db.refresh(new_emp)
    return new_emp

@router.post("/{employer_id}/verify", response_model=EmployerOut)
def verify_employer(employer_id: int, payload: EmployerVerify, db: Session = Depends(get_db)):
    emp = db.query(Employer).filter(Employer.id == employer_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employer not found.")

    emp.verification_status = payload.status
    emp.verified_by = payload.verified_by or "Admin (MSDE Nodal Officer)"
    emp.verified_at = datetime.datetime.now(datetime.timezone.utc)

    # Record verified block on blockchain
    if payload.status == "Verified":
        tx_hash = blockchain_service.record_employer_verification(
            employer_name=emp.company_name,
            gst=emp.gst_number or "NA",
            proof_file=emp.placement_proof_file or "verified_mou.pdf",
            verified_by=emp.verified_by
        )
        emp.blockchain_tx_hash = tx_hash

    audit = AuditLog(
        user_identity=payload.verified_by or "Admin",
        role="Admin",
        action="VERIFY_EMPLOYER",
        entity_type="Employer",
        entity_id=str(employer_id),
        details=f"Employer '{emp.company_name}' status changed to {payload.status}",
        ip_address="127.0.0.1",
        timestamp=datetime.datetime.now(datetime.timezone.utc)
    )
    db.add(audit)
    db.commit()
    db.refresh(emp)
    return emp

@router.post("/mock-upload-proof")
def upload_mock_proof(
    employer_id: Optional[int] = Form(None),
    document_type: str = Form("Offer Letter / Appointment Letter"),
    filename: str = Form("sample_appointment_letter.pdf")
):
    """Simulates secure proof document upload."""
    mock_url = f"/static/proofs/{filename}"
    return {
        "success": True,
        "document_type": document_type,
        "filename": filename,
        "file_url": mock_url,
        "sha256_checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "message": "Placement proof document uploaded & cryptographically hashed successfully."
    }

@router.get("/blockchain-ledger")
def get_blockchain_ledger():
    """Returns the immutable SHA-256 block chain for employer placement verifications."""
    chain = blockchain_service.get_chain()
    is_valid = blockchain_service.verify_integrity()
    return {
        "blockchain_network": "SkillTrack Private Consortium Ledger (Hyperledger Fabric Mock)",
        "total_blocks": len(chain),
        "chain_integrity_verified": is_valid,
        "blocks": chain
    }

# Self-Employment Endpoints
@router.get("/self-employment", response_model=List[SelfEmploymentOut])
def get_self_employment_records(db: Session = Depends(get_db)):
    records = db.query(SelfEmploymentRecord).order_by(SelfEmploymentRecord.created_at.desc()).all()
    return records

@router.post("/self-employment", response_model=SelfEmploymentOut)
def register_self_employment(payload: SelfEmploymentCreate, db: Session = Depends(get_db)):
    now_dt = datetime.datetime.now(datetime.timezone.utc)
    se = SelfEmploymentRecord(
        trainee_id=payload.trainee_id,
        business_name=payload.business_name,
        business_type=payload.business_type,
        udyam_reg_number=payload.udyam_reg_number or "UDYAM-TS-00-123456",
        gst_number=payload.gst_number,
        monthly_revenue=payload.monthly_revenue or 20000.0,
        proof_document_type=payload.proof_document_type or "Udyam Certificate",
        proof_file=f"udyam_cert_{payload.trainee_id}.pdf",
        verification_status="Verified",
        created_at=now_dt
    )
    db.add(se)
    db.commit()
    db.refresh(se)
    return se
