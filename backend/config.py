import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "उद्यम Track API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "skilltrack-gov-secure-jwt-key-2026-dpdp-compliant")
    ENCRYPTION_KEY: str = os.getenv("ENCRYPTION_KEY", "6dE0-W9-rN-Y9U0u5_F3v4S3l6k7l8m9n0o1p2q3r4s=")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./skilltrack.db")

    # Allowed Reference Values
    COURSES: list[str] = [
        "Electrician",
        "Welder",
        "Data Entry Operator",
        "Retail Associate",
        "Healthcare Assistant",
    ]
    DISTRICTS: list[str] = [
        "Hyderabad",
        "Visakhapatnam",
        "Vijayawada",
        "Guntur",
        "Warangal",
    ]
    PROVIDERS: list[str] = [
        "National Skill Training Institute (NSTI)",
        "Apex Vocational Academy",
        "Pradhan Mantri Kaushal Kendra (PMKK)",
        "Telangana Skill Development Mission (TSDM)",
        "Andhra Pradesh State Skill Development (APSSDC)",
    ]
    ATTRITION_REASONS: list[str] = [
        "Low Salary",
        "Skills Mismatch",
        "No jobs in area",
        "Health / Family",
        "Poor Workplace Fit",
        "Relocation / Distance",
        "Higher Education",
    ]

settings = Settings()
