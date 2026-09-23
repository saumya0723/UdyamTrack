import datetime
from typing import Optional, List
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Trainee, FollowUpResponse, AuditLog
from backend.schemas import BotSimulateRequest

router = APIRouter(prefix="/bot", tags=["WhatsApp & SMS Follow-Up Bot"])

class ChatTurnRequest(BaseModel):
    trainee_id: str
    milestone: str = "6M"
    step: int = 1  # 1: Asking employment status, 2: Asking salary / reason, 3: Completed
    user_reply: str

@router.post("/simulate-followup")
def simulate_followup(payload: BotSimulateRequest, db: Session = Depends(get_db)):
    """
    Simulates a scheduled 3M/6M/12M automated follow-up survey via WhatsApp/SMS gateway.
    Updates the trainee record and creates a response log.
    Automatically flags remedial intervention if wage drops by > 15% or employment is lost.
    """
    trainee = db.query(Trainee).filter(Trainee.id == payload.trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee not found.")

    now_dt = datetime.datetime.now(datetime.timezone.utc)
    old_wage = trainee.current_wage
    flag_remedial = False
    remedial_reason = None

    if payload.is_employed:
        new_status = "Placed"
        salary = payload.salary or old_wage or 15000.0
        
        # Check for wage drop > 15%
        if old_wage > 0 and salary < (old_wage * 0.85):
            flag_remedial = True
            remedial_reason = f"Wage reduced from ₹{old_wage:,.0f} to ₹{salary:,.0f} (>15% decline at {payload.milestone})."

        trainee.employment_status = "Placed"
        trainee.current_wage = salary
        trainee.retention_status = True
        trainee.attrition_reason = None

        if payload.milestone == "3M":
            trainee.wage_m3 = salary
        elif payload.milestone == "6M":
            trainee.wage_m6 = salary
        elif payload.milestone == "12M":
            trainee.wage_m12 = salary

        chat_transcript = (
            f"Bot: Hi {trainee.name}, this is SkillTrack (MSDE). Are you currently employed? (Y/N)\n"
            f"Trainee: Y\n"
            f"Bot: Great! What is your current monthly in-hand salary? (₹)\n"
            f"Trainee: ₹{salary:,.0f}\n"
            f"Bot: Thank you {trainee.name}! Your {payload.milestone} outcome is verified."
        )
    else:
        new_status = "Unemployed"
        flag_remedial = True
        reason = payload.attrition_reason or "Skills mismatch"
        remedial_reason = f"Reported job loss / non-placement at {payload.milestone} milestone: {reason}"

        trainee.employment_status = "Unemployed"
        trainee.retention_status = False
        trainee.attrition_reason = reason
        trainee.current_wage = 0.0

        if payload.milestone == "3M":
            trainee.wage_m3 = 0.0
        elif payload.milestone == "6M":
            trainee.wage_m6 = 0.0
        elif payload.milestone == "12M":
            trainee.wage_m12 = 0.0

        chat_transcript = (
            f"Bot: Hi {trainee.name}, this is SkillTrack (MSDE). Are you currently employed? (Y/N)\n"
            f"Trainee: N\n"
            f"Bot: What is the primary reason for non-placement? (Skills mismatch / Low salary / No jobs in area / Health / Other)\n"
            f"Trainee: {reason}\n"
            f"Bot: Thank you. Your response has been noted and routed to District Employment Remedial Cell."
        )

    if flag_remedial:
        trainee.remedial_flag = True
        trainee.remedial_notes = remedial_reason

    # Add Follow-up log
    f_resp = FollowUpResponse(
        trainee_id=trainee.id,
        milestone=payload.milestone,
        channel=payload.channel,
        sent_timestamp=now_dt - datetime.timedelta(minutes=5),
        response_received=True,
        response_timestamp=now_dt,
        reported_status=trainee.employment_status,
        reported_wage=trainee.current_wage,
        attrition_reason=trainee.attrition_reason,
        raw_chat_log=chat_transcript,
        flagged_for_action=flag_remedial
    )
    db.add(f_resp)

    # Audit log
    audit = AuditLog(
        user_identity="Automated Bot Service",
        role="Bot",
        action="RECORD_BOT_FOLLOWUP",
        entity_type="FollowUp",
        entity_id=trainee.id,
        details=f"Processed {payload.channel} {payload.milestone} survey response for {trainee.id}. Remedial Flag={flag_remedial}",
        ip_address="127.0.0.1",
        timestamp=now_dt
    )
    db.add(audit)
    db.commit()

    return {
        "success": True,
        "trainee_id": trainee.id,
        "milestone": payload.milestone,
        "channel": payload.channel,
        "employment_status": trainee.employment_status,
        "current_wage": trainee.current_wage,
        "remedial_flagged": flag_remedial,
        "remedial_reason": remedial_reason,
        "chat_transcript": chat_transcript
    }

@router.post("/chat-turn")
def interactive_chat_turn(payload: ChatTurnRequest, db: Session = Depends(get_db)):
    """Interactive multi-turn chatbot simulator for live phone mockup."""
    trainee = db.query(Trainee).filter(Trainee.id == payload.trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee not found.")

    step = payload.step
    user_input = payload.user_reply.strip()

    if step == 1:
        # Starting prompt
        return {
            "step": 2,
            "bot_message": f"Hi {trainee.name}! This is the SkillTrack Automated Bot. We are checking in for your {payload.milestone} skilling outcome. Are you currently employed or running a business? (Reply YES / NO)",
            "options": ["Yes, I am Employed", "Yes, I am Self-Employed", "No, I am Unemployed"],
            "completed": False
        }

    elif step == 2:
        norm = user_input.lower()
        if "yes" in norm or "employed" in norm:
            is_self = "self" in norm
            return {
                "step": 3,
                "bot_message": f"Excellent! What is your current monthly salary or net business income? (e.g. ₹18,000)",
                "options": ["₹12,000/mo", "₹16,500/mo", "₹22,000/mo", "₹28,000/mo"],
                "context": {"is_employed": True, "status": "Self-Employed" if is_self else "Placed"},
                "completed": False
            }
        else:
            return {
                "step": 3,
                "bot_message": "Understood. What is the primary reason for non-placement?",
                "options": ["Skills Mismatch", "Low Salary Offered", "No jobs in area", "Health / Family", "Relocation / Distance"],
                "context": {"is_employed": False, "status": "Unemployed"},
                "completed": False
            }

    elif step == 3:
        # Finalization
        # Extract salary number or reason
        digits = "".join(filter(str.isdigit, user_input))
        if digits:
            salary_val = float(digits)
            # Execute simulation update
            simulate_followup(
                BotSimulateRequest(
                    trainee_id=trainee.id,
                    milestone=payload.milestone,
                    channel="WhatsApp",
                    is_employed=True,
                    salary=salary_val
                ),
                db
            )
            return {
                "step": 4,
                "bot_message": f"Thank you {trainee.name}! Your response (Salary: ₹{salary_val:,.0f}) has been verified and updated in the National Skills Registry. Have a great day!",
                "completed": True,
                "options": []
            }
        else:
            reason_text = user_input
            simulate_followup(
                BotSimulateRequest(
                    trainee_id=trainee.id,
                    milestone=payload.milestone,
                    channel="WhatsApp",
                    is_employed=False,
                    attrition_reason=reason_text
                ),
                db
            )
            return {
                "step": 4,
                "bot_message": f"Thank you {trainee.name}. We have registered your reason ('{reason_text}') and alerted the District Employment Remedial Desk for placement support.",
                "completed": True,
                "options": []
            }

    return {"step": step, "bot_message": "Thank you for participating.", "completed": True}

@router.get("/logs/{trainee_id}")
def get_bot_logs(trainee_id: str, db: Session = Depends(get_db)):
    logs = db.query(FollowUpResponse).filter(FollowUpResponse.trainee_id == trainee_id).order_by(FollowUpResponse.sent_timestamp.asc()).all()
    return logs

@router.get("/summary")
def get_bot_summary(db: Session = Depends(get_db)):
    total_dispatched = db.query(FollowUpResponse).count()
    responses = db.query(FollowUpResponse).filter(FollowUpResponse.response_received == True).count()
    flagged = db.query(FollowUpResponse).filter(FollowUpResponse.flagged_for_action == True).count()

    return {
        "total_surveys_dispatched": total_dispatched,
        "responses_received": responses,
        "response_rate_pct": round((responses / total_dispatched * 100), 1) if total_dispatched > 0 else 0,
        "remedial_alerts_triggered": flagged,
        "channels": {
            "WhatsApp": 78.4,
            "SMS": 21.6
        }
    }
