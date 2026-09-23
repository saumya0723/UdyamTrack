import os
import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.config import settings
from backend.database import engine, Base, SessionLocal
from backend.models import Trainee
from backend.seed import seed_database

# Import routers
from backend.routes.auth import router as auth_router
from backend.routes.trainees import router as trainees_router
from backend.routes.outcomes import router as outcomes_router
from backend.routes.bot import router as bot_router
from backend.routes.employers import router as employers_router
from backend.routes.analytics import router as analytics_router
from backend.routes.compliance import router as compliance_router
from backend.routes.reports import router as reports_router

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="**From Training Records to Livelihood Intelligence**\n\nAI-Powered Longitudinal Outcome & Omnichannel Impact Measurement System.\n\nउद्यम Track provides consent-based trainee records, employment and self-employment outcomes, follow-up workflows, employer verification, analytics, and reporting.\n\nPresented by **Team Manthan**.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(trainees_router, prefix=settings.API_V1_STR)
app.include_router(outcomes_router, prefix=settings.API_V1_STR)
app.include_router(bot_router, prefix=settings.API_V1_STR)
app.include_router(employers_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(compliance_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)

# Ensure sample database exists on startup
@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        count = db.query(Trainee).count()
        if count == 0:
            print("[INFO] Database is empty. Running initial seeder...")
            seed_database()
        else:
            print(f"[INFO] Database initialized with {count} trainees.")
    finally:
        db.close()

# Frontend Directory
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")

if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

@app.get("/")
def serve_index():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "उद्यम Track API is running. Navigate to /docs for interactive Swagger API."}

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "system": "उद्यम Track Longitudinal Outcomes System",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "compliance": "DPDP Act 2023 Verified",
        "version": settings.VERSION
    }
