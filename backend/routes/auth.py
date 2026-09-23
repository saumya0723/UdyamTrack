import random
import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import User, AuditLog
from backend.schemas import LoginRequest, TokenOut, OTPRequest, OTPVerifyRequest
from backend.security import verify_password, create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["Authentication & Access"])

# In-memory OTP storage for mock verification simulation
otp_store = {}

@router.post("/login", response_model=TokenOut)
def login(creds: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == creds.username).first()
    if not user or not verify_password(creds.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password. Demo accounts: admin/admin123, provider/provider123, employer/employer123"
        )

    token = create_access_token(
        subject=user.username,
        role=user.role,
        extra_claims={"org": user.organization}
    )

    # Log audit event
    audit = AuditLog(
        user_identity=user.username,
        role=user.role,
        action="USER_LOGIN",
        entity_type="User",
        entity_id=str(user.id),
        details=f"Successful login as {user.role} ({user.organization})",
        ip_address="127.0.0.1",
        timestamp=datetime.datetime.now(datetime.timezone.utc)
    )
    db.add(audit)
    db.commit()

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role,
            "organization": user.organization
        }
    }

@router.post("/send-otp")
def send_otp(payload: OTPRequest):
    """Simulates sending an OTP to the trainee's mobile for DPDP onboarding verification."""
    clean_mob = "".join(filter(str.isdigit, payload.mobile))
    if len(clean_mob) < 10:
        raise HTTPException(status_code=400, detail="Invalid mobile number format. Must be 10 digits.")
    
    # Generate 6-digit OTP
    otp_code = str(random.randint(100000, 999999))
    otp_store[clean_mob[-10:]] = {
        "otp": otp_code,
        "expires_at": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=10)
    }

    return {
        "success": True,
        "message": f"OTP successfully dispatched via SMS gateway to +91 {clean_mob[-10:]}",
        "simulated_otp": otp_code,  # Provided in response for easy frontend demo testing!
        "valid_for_seconds": 600
    }

@router.post("/verify-otp")
def verify_otp(payload: OTPVerifyRequest):
    """Validates the OTP entered by trainee."""
    clean_mob = "".join(filter(str.isdigit, payload.mobile))[-10:]
    record = otp_store.get(clean_mob)

    # Allow "123456" as universal demo bypass or exact match
    if payload.otp == "123456" or (record and record["otp"] == payload.otp):
        return {
            "verified": True,
            "message": "Aadhaar-linked mobile verified successfully."
        }
    
    raise HTTPException(status_code=400, detail="Invalid or expired OTP code. Try entering 123456 for demo.")

@router.get("/me")
def get_current_user_profile(authorization: str = Header(None), db: Session = Depends(get_db)):
    """Validates JWT token and returns user details."""
    if not authorization or not authorization.startswith("Bearer "):
        return {"authenticated": False, "role": "Guest"}
    
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        return {"authenticated": False, "role": "Guest"}
    
    return {
        "authenticated": True,
        "username": payload.get("sub"),
        "role": payload.get("role"),
        "organization": payload.get("org")
    }
