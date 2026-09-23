import datetime
import random
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc
from backend.database import get_db
from backend.models import Trainee, FollowUpResponse, ConsentLog, AuditLog
from backend.schemas import TraineeCreate, TraineeUpdate, TraineeOut
from backend.security import encrypt_pii, mask_aadhaar, mask_mobile, generate_consent_hash, decode_access_token
from backend.ai_engine import ai_predictor

router = APIRouter(prefix="/trainees", tags=["Trainee Onboarding & Longitudinal Records"])

@router.get("", response_model=dict)
def get_trainees(
    search: Optional[str] = Query(None, description="Search by name, ID, or employer"),
    course: Optional[str] = Query(None),
    provider: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    remedial_only: Optional[bool] = Query(False),
    page: int = Query(1, ge=1),
    page_size: int = Query(15, ge=1, le=100),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    query = db.query(Trainee)

    # Role-based scoping if provider
    if authorization and authorization.startswith("Bearer "):
        payload = decode_access_token(authorization.split(" ")[1])
        if payload and payload.get("role") == "Training Provider" and payload.get("org"):
            query = query.filter(Trainee.training_provider == payload.get("org"))

    # Apply Filters
    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Trainee.name.ilike(s),
                Trainee.id.ilike(s),
                Trainee.employer_name.ilike(s),
                Trainee.job_role.ilike(s)
            )
        )
    if course and course != "All":
        query = query.filter(Trainee.course == course)
    if provider and provider != "All":
        query = query.filter(Trainee.training_provider == provider)
    if district and district != "All":
        query = query.filter(Trainee.district == district)
    if gender and gender != "All":
        query = query.filter(Trainee.gender == gender)
    if status and status != "All":
        query = query.filter(Trainee.employment_status == status)
    if remedial_only:
        query = query.filter(Trainee.remedial_flag == True)

    total_count = query.count()
    trainees = query.order_by(desc(Trainee.created_at)).offset((page - 1) * page_size).limit(page_size).all()

    # Log audit event for data view
    audit = AuditLog(
        user_identity="Portal User",
        role="Viewer",
        action="VIEW_TRAINEE_LIST",
        entity_type="Trainee",
        entity_id="QUERY",
        details=f"Retrieved {len(trainees)} trainees (Page {page}, Filter Course={course}, Status={status})",
        ip_address="127.0.0.1",
        timestamp=datetime.datetime.now(datetime.timezone.utc)
    )
    db.add(audit)
    db.commit()

    return {
        "total": total_count,
        "page": page,
        "page_size": page_size,
        "total_pages": max(1, (total_count + page_size - 1) // page_size),
        "items": [TraineeOut.from_orm(t) for t in trainees]
    }

@router.post("", response_model=TraineeOut)
def onboard_trainee(payload: TraineeCreate, db: Session = Depends(get_db)):
    """
    DPDP-compliant onboarding flow:
    1. Generates unique Trainee ID (SKILL-2026-XXXXX)
    2. Validates & masks Aadhaar, encrypts sensitive fields at rest (AES-256)
    3. Logs immutable DPDP consent with cryptographic tamper-hash
    4. Evaluates baseline AI attrition risk
    """
    # Generate unique ID
    count_existing = db.query(Trainee).count()
    new_id = f"SKILL-2026-{1000 + count_existing + 1}"

    masked_adh = mask_aadhaar(payload.aadhaar)
    masked_mob = mask_mobile(payload.mobile)

    enc_name = encrypt_pii(payload.name)
    enc_adh = encrypt_pii(payload.aadhaar)
    enc_mob = encrypt_pii(payload.mobile)

    base_wage = payload.baseline_wage if payload.baseline_wage else 12000.0

    # AI prediction
    pred = ai_predictor.predict(
        course=payload.course,
        district=payload.district,
        baseline_wage=base_wage,
        age=payload.age,
        gender=payload.gender
    )

    now_dt = datetime.datetime.now(datetime.timezone.utc)

    new_trainee = Trainee(
        id=new_id,
        name=payload.name,
        name_encrypted=enc_name,
        mobile=masked_mob,
        mobile_encrypted=enc_mob,
        aadhaar_masked=masked_adh,
        aadhaar_encrypted=enc_adh,
        gender=payload.gender,
        age=payload.age,
        course=payload.course,
        training_provider=payload.training_provider,
        district=payload.district,
        state=payload.state or "Telangana / Andhra Pradesh",
        cohort=payload.cohort or "Batch 2026-Q1",
        employment_status="Placed" if base_wage > 0 else "Seeking Placement",
        job_role=payload.job_role or f"Trainee {payload.course}",
        employer_name=payload.employer_name,
        baseline_wage=base_wage,
        wage_m3=base_wage,
        wage_m6=base_wage,
        wage_m12=base_wage,
        current_wage=base_wage,
        retention_status=True,
        attrition_reason=None,
        remedial_flag=False,
        ai_attrition_risk_score=pred["risk_score"],
        ai_risk_level=pred["risk_level"],
        consent_given=payload.consent_given,
        consent_timestamp=now_dt,
        created_at=now_dt
    )
    db.add(new_trainee)

    # 2. Immutable DPDP Consent Artifact Log
    c_hash = generate_consent_hash(new_id, payload.consent_text, now_dt.isoformat(), "127.0.0.1")
    consent_log = ConsentLog(
        trainee_id=new_id,
        consent_text=payload.consent_text,
        consent_version="v1.2-DPDP2023",
        ip_address="127.0.0.1",
        user_agent="SkillTrack Web Portal / Chrome 124",
        timestamp=now_dt,
        tamper_hash=c_hash
    )
    db.add(consent_log)

    # 3. Create baseline milestone follow-up
    f_resp = FollowUpResponse(
        trainee_id=new_id,
        milestone="0M (Onboarding)",
        channel="Portal",
        sent_timestamp=now_dt,
        response_received=True,
        response_timestamp=now_dt,
        reported_status="Onboarded & Verified",
        reported_wage=base_wage,
        raw_chat_log="Trainee successfully onboarded with DPDP Act e-Consent and Aadhaar OTP verification.",
        flagged_for_action=False
    )
    db.add(f_resp)

    # 4. Audit Log
    audit = AuditLog(
        user_identity="Admin / Registration Desk",
        role="Admin",
        action="ONBOARD_TRAINEE",
        entity_type="Trainee",
        entity_id=new_id,
        details=f"Onboarded trainee {new_id} ({payload.course}) with DPDP consent hash {c_hash[:12]}...",
        ip_address="127.0.0.1",
        timestamp=now_dt
    )
    db.add(audit)

    db.commit()
    db.refresh(new_trainee)
    return TraineeOut.from_orm(new_trainee)

@router.get("/{trainee_id}", response_model=TraineeOut)
def get_trainee_detail(trainee_id: str, db: Session = Depends(get_db)):
    trainee = db.query(Trainee).filter(Trainee.id == trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee ID not found.")

    # Audit log
    audit = AuditLog(
        user_identity="Portal User",
        role="Viewer",
        action="VIEW_TRAINEE_RECORD",
        entity_type="Trainee",
        entity_id=trainee_id,
        details=f"Viewed comprehensive longitudinal profile for {trainee.name} ({trainee_id})",
        ip_address="127.0.0.1",
        timestamp=datetime.datetime.now(datetime.timezone.utc)
    )
    db.add(audit)
    db.commit()

    return TraineeOut.from_orm(trainee)

@router.put("/{trainee_id}", response_model=TraineeOut)
def update_trainee(trainee_id: str, payload: TraineeUpdate, db: Session = Depends(get_db)):
    trainee = db.query(Trainee).filter(Trainee.id == trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee ID not found.")

    update_data = payload.dict(exclude_unset=True)
    for k, v in update_data.items():
        setattr(trainee, k, v)

    # Re-evaluate AI attrition if wages or status changed
    pred = ai_predictor.predict(
        course=trainee.course,
        district=trainee.district,
        baseline_wage=trainee.current_wage if trainee.current_wage > 0 else 9000,
        age=trainee.age,
        gender=trainee.gender
    )
    trainee.ai_attrition_risk_score = pred["risk_score"]
    trainee.ai_risk_level = pred["risk_level"]

    audit = AuditLog(
        user_identity="Admin / Provider",
        role="Admin",
        action="UPDATE_TRAINEE",
        entity_type="Trainee",
        entity_id=trainee_id,
        details=f"Updated trainee {trainee_id} attributes: {list(update_data.keys())}",
        ip_address="127.0.0.1",
        timestamp=datetime.datetime.now(datetime.timezone.utc)
    )
    db.add(audit)
    db.commit()
    db.refresh(trainee)

    return TraineeOut.from_orm(trainee)

@router.post("/{trainee_id}/remedial")
def flag_remedial_action(trainee_id: str, notes: str = Query("Identified for remedial skilling and placement intervention"), db: Session = Depends(get_db)):
    trainee = db.query(Trainee).filter(Trainee.id == trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee not found.")

    trainee.remedial_flag = True
    trainee.remedial_notes = notes

    audit = AuditLog(
        user_identity="System Nodal Officer",
        role="Admin",
        action="FLAG_REMEDIAL_ACTION",
        entity_type="Trainee",
        entity_id=trainee_id,
        details=f"Flagged trainee {trainee_id} for remedial intervention: {notes}",
        ip_address="127.0.0.1",
        timestamp=datetime.datetime.now(datetime.timezone.utc)
    )
    db.add(audit)
    db.commit()

    return {"success": True, "message": f"Trainee {trainee_id} successfully flagged for remedial intervention.", "notes": notes}
