import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class LoginRequest(BaseModel):
    username: str
    password: str

class OTPRequest(BaseModel):
    mobile: str

class OTPVerifyRequest(BaseModel):
    mobile: str
    otp: str

# Trainee Schemas
class TraineeBase(BaseModel):
    name: str
    mobile: str
    aadhaar: str
    gender: str = "Male"
    age: int = 22
    course: str
    training_provider: str
    district: str
    state: Optional[str] = "Telangana / Andhra Pradesh"
    cohort: Optional[str] = "Batch 2025-Q1"

class TraineeCreate(TraineeBase):
    consent_given: bool = True
    consent_text: str = "I consent to my training data being linked with employment outcomes for 12 months under DPDP Act 2023."
    job_role: Optional[str] = None
    employer_name: Optional[str] = None
    baseline_wage: Optional[float] = 0.0

class TraineeUpdate(BaseModel):
    employment_status: Optional[str] = None
    job_role: Optional[str] = None
    employer_name: Optional[str] = None
    baseline_wage: Optional[float] = None
    wage_m3: Optional[float] = None
    wage_m6: Optional[float] = None
    wage_m12: Optional[float] = None
    current_wage: Optional[float] = None
    retention_status: Optional[bool] = None
    attrition_reason: Optional[str] = None
    remedial_flag: Optional[bool] = None
    remedial_notes: Optional[str] = None

class FollowUpOut(BaseModel):
    id: int
    trainee_id: str
    milestone: str
    channel: str
    sent_timestamp: Optional[datetime.datetime]
    response_received: bool
    response_timestamp: Optional[datetime.datetime]
    reported_status: Optional[str]
    reported_wage: Optional[float]
    attrition_reason: Optional[str]
    raw_chat_log: Optional[str]
    flagged_for_action: bool

    class Config:
        from_attributes = True

class TraineeOut(BaseModel):
    id: str
    name: str
    mobile: str
    aadhaar_masked: str
    gender: str
    age: int
    course: str
    training_provider: str
    district: str
    state: str
    cohort: str
    employment_status: str
    job_role: Optional[str]
    employer_name: Optional[str]
    baseline_wage: float
    wage_m3: float
    wage_m6: float
    wage_m12: float
    current_wage: float
    retention_status: bool
    attrition_reason: Optional[str]
    remedial_flag: bool
    remedial_notes: Optional[str]
    ai_attrition_risk_score: float
    ai_risk_level: str
    consent_given: bool
    consent_timestamp: Optional[datetime.datetime]
    created_at: Optional[datetime.datetime]
    follow_ups: Optional[List[FollowUpOut]] = []

    class Config:
        from_attributes = True

# Employer Schemas
class EmployerCreate(BaseModel):
    company_name: str
    industry_sector: str = "Manufacturing"
    gst_number: Optional[str] = None
    udyam_number: Optional[str] = None
    contact_person: str
    contact_email: str
    contact_phone: str
    district: str = "Hyderabad"
    placement_proof_file: Optional[str] = "offer_letter_sample.pdf"

class EmployerOut(BaseModel):
    id: int
    company_name: str
    industry_sector: str
    gst_number: Optional[str]
    udyam_number: Optional[str]
    contact_person: str
    contact_email: str
    contact_phone: str
    district: str
    verification_status: str
    verified_at: Optional[datetime.datetime]
    verified_by: Optional[str]
    placement_proof_file: Optional[str]
    blockchain_tx_hash: Optional[str]
    active_hires_count: int
    created_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True

class EmployerVerify(BaseModel):
    status: str  # Verified, Rejected, Pending
    verified_by: Optional[str] = "Admin"

# Self Employment Schemas
class SelfEmploymentCreate(BaseModel):
    trainee_id: str
    business_name: str
    business_type: str
    udyam_reg_number: Optional[str] = None
    gst_number: Optional[str] = None
    monthly_revenue: Optional[float] = 20000.0
    proof_document_type: Optional[str] = "Udyam Certificate"

class SelfEmploymentOut(BaseModel):
    id: int
    trainee_id: str
    business_name: str
    business_type: str
    udyam_reg_number: Optional[str]
    gst_number: Optional[str]
    monthly_revenue: float
    proof_document_type: str
    proof_file: Optional[str]
    verification_status: str
    created_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True

# Consent & Audit Schemas
class ConsentLogOut(BaseModel):
    id: int
    trainee_id: str
    consent_text: str
    consent_version: str
    ip_address: str
    user_agent: str
    timestamp: datetime.datetime
    tamper_hash: str

    class Config:
        from_attributes = True

class AuditLogOut(BaseModel):
    id: int
    user_identity: str
    role: str
    action: str
    entity_type: str
    entity_id: Optional[str]
    details: Optional[str]
    ip_address: str
    timestamp: datetime.datetime

    class Config:
        from_attributes = True

# Bot Simulator Schemas
class BotSimulateRequest(BaseModel):
    trainee_id: str
    milestone: str = "3M"  # 3M, 6M, 12M
    channel: str = "WhatsApp"
    is_employed: bool
    salary: Optional[float] = None
    attrition_reason: Optional[str] = None

# AI Prediction Schemas
class AIPredictRequest(BaseModel):
    course: str
    district: str
    baseline_wage: float
    age: int = 22
    gender: str = "Male"
    current_milestone: str = "6M"

class AIPredictResponse(BaseModel):
    risk_score: float
    risk_level: str
    attrition_probability: float
    key_risk_factors: List[str]
    recommendations: List[str]
