import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(30), default="Admin")  # Admin, Training Provider, Employer
    organization = Column(String(150), default="Ministry of Skill Development & Entrepreneurship")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Trainee(Base):
    __tablename__ = "trainees"

    id = Column(String(30), primary_key=True, index=True)  # e.g. SKILL-2026-00101
    name = Column(String(100), nullable=False)
    name_encrypted = Column(Text, nullable=True)
    mobile = Column(String(30), nullable=False)
    mobile_encrypted = Column(Text, nullable=True)
    aadhaar_masked = Column(String(20), nullable=False)
    aadhaar_encrypted = Column(Text, nullable=True)
    gender = Column(String(20), default="Male")  # Male, Female, Other
    age = Column(Integer, default=22)
    course = Column(String(100), nullable=False)
    training_provider = Column(String(150), nullable=False)
    district = Column(String(100), nullable=False)
    state = Column(String(100), default="Telangana / Andhra Pradesh")
    cohort = Column(String(50), default="Batch 2025-Q1")
    
    # Outcome tracking
    employment_status = Column(String(30), default="Placed")  # Placed, Self-Employed, Unemployed
    job_role = Column(String(100), nullable=True)
    employer_name = Column(String(150), nullable=True)
    
    # Longitudinal Wage Progression
    baseline_wage = Column(Float, default=0.0)    # Month 0
    wage_m3 = Column(Float, default=0.0)          # Month 3
    wage_m6 = Column(Float, default=0.0)          # Month 6
    wage_m12 = Column(Float, default=0.0)         # Month 12
    current_wage = Column(Float, default=0.0)
    
    # Retention & Remedial Actions
    retention_status = Column(Boolean, default=True)  # True = Still Employed, False = Left/Lost Job
    attrition_reason = Column(String(150), nullable=True)
    remedial_flag = Column(Boolean, default=False)
    remedial_notes = Column(Text, nullable=True)
    
    # AI Risk Signals
    ai_attrition_risk_score = Column(Float, default=15.0)  # 0 to 100
    ai_risk_level = Column(String(20), default="Low")       # Low, Medium, High
    
    # DPDP Act Consent
    consent_given = Column(Boolean, default=True)
    consent_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    follow_ups = relationship("FollowUpResponse", back_populates="trainee", cascade="all, delete-orphan")
    consent_logs = relationship("ConsentLog", back_populates="trainee", cascade="all, delete-orphan")
    self_employment_records = relationship("SelfEmploymentRecord", back_populates="trainee", cascade="all, delete-orphan")


class FollowUpResponse(Base):
    __tablename__ = "follow_up_responses"

    id = Column(Integer, primary_key=True, index=True)
    trainee_id = Column(String(30), ForeignKey("trainees.id"), index=True, nullable=False)
    milestone = Column(String(10), nullable=False)  # 3M, 6M, 12M
    channel = Column(String(20), default="WhatsApp")  # WhatsApp, SMS
    sent_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    response_received = Column(Boolean, default=True)
    response_timestamp = Column(DateTime, nullable=True)
    reported_status = Column(String(30), default="Employed")  # Employed, Self-Employed, Unemployed
    reported_wage = Column(Float, default=0.0)
    attrition_reason = Column(String(150), nullable=True)
    raw_chat_log = Column(Text, nullable=True)
    flagged_for_action = Column(Boolean, default=False)

    trainee = relationship("Trainee", back_populates="follow_ups")


class Employer(Base):
    __tablename__ = "employers"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(150), nullable=False, index=True)
    industry_sector = Column(String(100), default="Manufacturing")
    gst_number = Column(String(30), nullable=True)
    udyam_number = Column(String(30), nullable=True)
    contact_person = Column(String(100), nullable=False)
    contact_email = Column(String(100), nullable=False)
    contact_phone = Column(String(30), nullable=False)
    district = Column(String(100), default="Hyderabad")
    verification_status = Column(String(30), default="Verified")  # Verified, Pending, Rejected
    verified_at = Column(DateTime, nullable=True)
    verified_by = Column(String(50), default="Admin (MSDE Validator)")
    placement_proof_file = Column(String(200), nullable=True)
    blockchain_tx_hash = Column(String(100), nullable=True)
    active_hires_count = Column(Integer, default=12)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class SelfEmploymentRecord(Base):
    __tablename__ = "self_employment_records"

    id = Column(Integer, primary_key=True, index=True)
    trainee_id = Column(String(30), ForeignKey("trainees.id"), index=True, nullable=False)
    business_name = Column(String(150), nullable=False)
    business_type = Column(String(100), nullable=False)  # Electrical Repairs, Retail Shop, Fabrication
    udyam_reg_number = Column(String(50), nullable=True)
    gst_number = Column(String(50), nullable=True)
    monthly_revenue = Column(Float, default=25000.0)
    proof_document_type = Column(String(50), default="Udyam Registration Certificate")
    proof_file = Column(String(200), default="udyam_cert_sample.pdf")
    verification_status = Column(String(30), default="Verified")  # Verified, Pending
    verified_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    trainee = relationship("Trainee", back_populates="self_employment_records")


class ConsentLog(Base):
    __tablename__ = "consent_logs"

    id = Column(Integer, primary_key=True, index=True)
    trainee_id = Column(String(30), ForeignKey("trainees.id"), index=True, nullable=False)
    consent_text = Column(Text, nullable=False)
    consent_version = Column(String(20), default="v1.2-DPDP2023")
    ip_address = Column(String(45), default="127.0.0.1")
    user_agent = Column(String(255), default="SkillTrack Portal / Mozilla/5.0")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    tamper_hash = Column(String(100), nullable=False)

    trainee = relationship("Trainee", back_populates="consent_logs")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_identity = Column(String(50), nullable=False)
    role = Column(String(30), nullable=False)
    action = Column(String(50), nullable=False)  # VIEW_TRAINEE, ONBOARD_TRAINEE, BOT_UPDATE, etc.
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(50), nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(45), default="127.0.0.1")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
