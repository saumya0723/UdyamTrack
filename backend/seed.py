import datetime
import random
import json
import sqlite3
from pathlib import Path
from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine, Base
from backend.models import User, Trainee, FollowUpResponse, Employer, SelfEmploymentRecord, ConsentLog, AuditLog
from backend.security import get_password_hash, encrypt_pii, mask_aadhaar, mask_mobile, generate_consent_hash
from backend.blockchain import blockchain_service
from backend.ai_engine import ai_predictor

FIRST_NAMES_M = [
    "Aarav", "Atharva", "Aditya", "Omkar", "Soham", "Vedant", "Rohan", "Pranav", "Sanket", "Sarthak",
    "Yash", "Nikhil", "Amey", "Kunal", "Tanmay", "Shreyas", "Siddharth", "Aniket", "Harsh", "Chinmay"
]
FIRST_NAMES_F = [
    "Ananya", "Rutuja", "Gauri", "Tejaswini", "Isha", "Vedika", "Anushka", "Aditi", "Mukta", "Mrunmayi",
    "Prajakta", "Sayali", "Madhura", "Manasi", "Sakshi", "Sanika", "Vaishnavi", "Sharvari", "Neha", "Sneha"
]
LAST_NAMES = [
    "Deshmukh", "Joshi", "Shinde", "Apte", "Kulkarni", "Patil", "Pawar", "Kale", "Bhosale", "Kamat",
    "Gokhale", "Jadhav", "Deshpande", "More", "Naik", "Sawant", "Chavan", "Dandekar", "Gadgil", "Kadam"
]

COURSES = [
    "Electrician",
    "Welder",
    "Data Entry Operator",
    "Retail Associate",
    "Healthcare Assistant"
]

DISTRICTS = [
    "Hyderabad",
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Warangal"
]

PROVIDERS = [
    "National Skill Training Institute (NSTI)",
    "Apex Vocational Academy",
    "Pradhan Mantri Kaushal Kendra (PMKK)",
    "Telangana Skill Development Mission (TSDM)",
    "Andhra Pradesh State Skill Development (APSSDC)"
]

EMPLOYERS_DATA = [
    {"name": "Sahyadri Buildworks Pvt Ltd", "sector": "Construction & Infrastructure", "gst": "DEMO-GST-001", "udyam": "DEMO-UDYAM-001", "contact": "Sanket Deshpande", "email": "careers@sahyadri-buildworks.example", "phone": "DEMO-000-001", "district": "Hyderabad", "hires": 28},
    {"name": "Pragati Electrical Systems Pvt Ltd", "sector": "Electrical & Energy", "gst": "DEMO-GST-002", "udyam": "DEMO-UDYAM-002", "contact": "Sayali Kulkarni", "email": "careers@pragati-electrical.example", "phone": "DEMO-000-002", "district": "Visakhapatnam", "hires": 19},
    {"name": "Jeevansparsh Care Services Pvt Ltd", "sector": "Healthcare & Allied", "gst": "DEMO-GST-003", "udyam": "DEMO-UDYAM-003", "contact": "Madhura Joshi", "email": "careers@jeevansparsh-care.example", "phone": "DEMO-000-003", "district": "Hyderabad", "hires": 34},
    {"name": "Sahyog Retail Network Pvt Ltd", "sector": "Retail & Logistics", "gst": "DEMO-GST-004", "udyam": "DEMO-UDYAM-004", "contact": "Rohan Patil", "email": "careers@sahyog-retail.example", "phone": "DEMO-000-004", "district": "Vijayawada", "hires": 41},
    {"name": "DnyanSetu Business Services Pvt Ltd", "sector": "IT & ITES / BPO", "gst": "DEMO-GST-005", "udyam": "DEMO-UDYAM-005", "contact": "Prajakta Deshmukh", "email": "careers@dnyansetu-services.example", "phone": "DEMO-000-005", "district": "Warangal", "hires": 22},
    {"name": "Aroha Wellness Supplies Pvt Ltd", "sector": "Healthcare & Pharmacy", "gst": "DEMO-GST-006", "udyam": "DEMO-UDYAM-006", "contact": "Omkar Gokhale", "email": "careers@aroha-wellness.example", "phone": "DEMO-000-006", "district": "Guntur", "hires": 16},
    {"name": "Deccan Precision Components Pvt Ltd", "sector": "Automotive & Heavy Industry", "gst": "DEMO-GST-007", "udyam": "DEMO-UDYAM-007", "contact": "Amey Jadhav", "email": "careers@deccan-precision.example", "phone": "DEMO-000-007", "district": "Visakhapatnam", "hires": 25},
    {"name": "Navdisha Supply Chain Pvt Ltd", "sector": "Retail & Supply Chain", "gst": "DEMO-GST-008", "udyam": "DEMO-UDYAM-008", "contact": "Manasi Apte", "email": "careers@navdisha-supply.example", "phone": "DEMO-000-008", "district": "Hyderabad", "hires": 18}
]

ATTRITION_REASONS = [
    "Low Salary",
    "Skills Mismatch",
    "No jobs in area",
    "Health / Family",
    "Poor Workplace Fit",
    "Relocation / Distance",
    "Higher Education"
]

def load_demo_identities():
    """Read the same identities used by apply_demo_names.py before changing any data."""
    source = Path(__file__).resolve().parent.parent / "demo_names.json"
    identities = json.loads(source.read_text(encoding="utf-8"))
    people = {p["id"]: p["name"] for p in identities["trainees"]}
    companies = identities["employers"]
    expected = {f"SKILL-2026-{1001+i}" for i in range(100)}
    if set(people) != expected or len(companies) != len(EMPLOYERS_DATA):
        raise ValueError("demo_names.json must contain the 100 demo trainee IDs and eight employers.")
    employers = []
    for original, company in zip(EMPLOYERS_DATA, sorted(companies, key=lambda e: e["id"])):
        employers.append({
            **original,
            "name": company["company_name"], "contact": company["contact_person"],
            "email": company["contact_email"], "phone": company["contact_phone"],
            "gst": company["gst_number"], "udyam": company["udyam_number"],
        })
    return people, employers


def seed_database(reset=False):
    names_by_id, employers_data = load_demo_identities()
    Base.metadata.create_all(bind=engine)
    with engine.connect() as connection:
        has_data = any(connection.execute(select(table).limit(1)).first() is not None
                       for table in Base.metadata.sorted_tables)
    if has_data and not reset:
        print("[INFO] Existing records found. Nothing changed.")
        print("[INFO] Start the app with: python server_run.py")
        print("[INFO] To deliberately replace ALL demo data, use: python -m backend.seed --reset")
        return
    if has_data:
        if engine.url.get_backend_name() != "sqlite" or not engine.url.database or engine.url.database == ":memory:":
            raise RuntimeError("Automatic reset backup supports a file-based SQLite database only.")
        database = Path(engine.url.database).resolve()
        backup = database.with_name(database.stem + ".before_seed." +
                                   datetime.datetime.now().strftime("%Y%m%d_%H%M%S_%f") + ".db")
        engine.dispose()
        with sqlite3.connect(database) as original, sqlite3.connect(backup) as copy:
            original.backup(copy)
        print(f"[INFO] Pre-reset backup: {backup}")
    print("[INFO] Initializing Database & Seeding 100 Trainees...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    random.seed(42)

    # 1. Seed Users (Admin, Provider, Employer)
    users = [
        User(
            username="admin",
            hashed_password=get_password_hash("admin123"),
            role="Admin",
            organization="Ministry of Skill Development (MSDE / NSDC)"
        ),
        User(
            username="provider",
            hashed_password=get_password_hash("provider123"),
            role="Training Provider",
            organization="National Skill Training Institute (NSTI)"
        ),
        User(
            username="employer",
            hashed_password=get_password_hash("employer123"),
            role="Employer",
            organization=employers_data[0]["name"]
        )
    ]
    db.add_all(users)
    db.commit()

    # 2. Seed Employers & Blockchain verification ledger
    created_employers = []
    for emp_data in employers_data:
        # Register proof on blockchain ledger
        tx_hash = blockchain_service.record_employer_verification(
            employer_name=emp_data["name"],
            gst=emp_data["gst"],
            proof_file="verified_placement_mou.pdf",
            verified_by="NSDC Enterprise Nodal Officer"
        )
        emp = Employer(
            company_name=emp_data["name"],
            industry_sector=emp_data["sector"],
            gst_number=emp_data["gst"],
            udyam_number=emp_data["udyam"],
            contact_person=emp_data["contact"],
            contact_email=emp_data["email"],
            contact_phone=emp_data["phone"],
            district=emp_data["district"],
            verification_status="Verified",
            verified_at=datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(20, 180)),
            verified_by="Admin (MSDE Validator)",
            placement_proof_file="verified_placement_mou.pdf",
            blockchain_tx_hash=tx_hash,
            active_hires_count=emp_data["hires"]
        )
        db.add(emp)
        created_employers.append(emp)
    db.commit()

    # 3. Seed 100 Synthetic Trainees
    # Distribution: 60 Placed, 20 Self-Employed, 20 Unemployed
    statuses = ["Placed"] * 60 + ["Self-Employed"] * 20 + ["Unemployed"] * 20
    random.shuffle(statuses)

    for i in range(100):
        t_id = f"SKILL-2026-{1000 + i + 1}"
        gender = "Female" if random.random() < 0.42 else "Male"
        first_name = random.choice(FIRST_NAMES_F if gender == "Female" else FIRST_NAMES_M)
        last_name = random.choice(LAST_NAMES)
        # Keep the two random draws above so other generated demo fields retain
        # the original deterministic sequence, then apply the canonical identity.
        full_name = names_by_id[t_id]
        first_name = full_name.split()[0]
        
        raw_aadhaar = f"{random.randint(2000, 9999)}{random.randint(1000, 9999)}{random.randint(1000, 9999)}"
        raw_mobile = f"+91 {random.randint(70000, 99999)}{random.randint(10000, 99999)}"
        
        masked_adh = mask_aadhaar(raw_aadhaar)
        masked_mob = mask_mobile(raw_mobile)
        
        enc_name = encrypt_pii(full_name)
        enc_aadhaar = encrypt_pii(raw_aadhaar)
        enc_mobile = encrypt_pii(raw_mobile)
        
        course = random.choice(COURSES)
        provider = random.choice(PROVIDERS)
        district = random.choice(DISTRICTS)
        age = random.randint(19, 32)
        cohort = random.choice(["Batch 2024-Q3", "Batch 2024-Q4", "Batch 2025-Q1"])
        
        status = statuses[i]

        # Starting baseline wage (M0)
        # Wage range: 8,000 - 35,000
        if course in ["Electrician", "Welder"]:
            base_wage = float(random.randint(130, 220) * 100)  # 13,000 - 22,000
            job_role = f"Certified {course} Specialist"
        elif course == "Healthcare Assistant":
            base_wage = float(random.randint(140, 250) * 100)  # 14,000 - 25,000
            job_role = "Healthcare Support Executive"
        elif course == "Data Entry Operator":
            base_wage = float(random.randint(100, 180) * 100)  # 10,000 - 18,000
            job_role = "Junior Data Ops Associate"
        else:  # Retail Associate
            base_wage = float(random.randint(90, 160) * 100)   # 9,000 - 16,000
            job_role = "Store Operations Associate"

        employer_name = None
        retention = True
        attrition_reason = None
        remedial_flag = False
        remedial_notes = None

        if status == "Placed":
            matched_emp = random.choice(created_employers)
            employer_name = matched_emp.company_name
            # Longitudinal progression: 3M, 6M, 12M
            # Realistic incremental hikes: +10% to +35% over 12 months
            w_m3 = round(base_wage * random.uniform(1.05, 1.15), -2)
            w_m6 = round(w_m3 * random.uniform(1.05, 1.20), -2)
            w_m12 = round(w_m6 * random.uniform(1.08, 1.25), -2)
            current_w = w_m12
            retention = True

            # Small subset might experience wage stagnation or drop
            if i % 15 == 0:
                w_m12 = round(w_m6 * 0.85, -2)
                current_w = w_m12
                remedial_flag = True
                remedial_notes = "Wage dropped by >15% at Month 12 milestone. Scheduled for upskilling counselling."

        elif status == "Self-Employed":
            job_role = f"Independent {course} Entrepreneur"
            base_wage = float(random.randint(110, 200) * 100)
            w_m3 = round(base_wage * random.uniform(1.10, 1.25), -2)
            w_m6 = round(w_m3 * random.uniform(1.10, 1.30), -2)
            w_m12 = round(w_m6 * random.uniform(1.10, 1.40), -2)
            current_w = w_m12
            retention = True

        else:  # Unemployed
            job_role = "Seeking Placement"
            base_wage = 0.0
            w_m3 = 0.0
            w_m6 = 0.0
            w_m12 = 0.0
            current_w = 0.0
            retention = False
            attrition_reason = random.choice(ATTRITION_REASONS)
            remedial_flag = True
            remedial_notes = f"Unemployed due to '{attrition_reason}'. Assigned to District Remedial Job Drive."

        # Compute AI Risk Score
        pred = ai_predictor.predict(
            course=course,
            district=district,
            baseline_wage=base_wage if base_wage > 0 else 9000,
            age=age,
            gender=gender
        )

        consent_dt = datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(200, 360))

        trainee = Trainee(
            id=t_id,
            name=full_name,
            name_encrypted=enc_name,
            mobile=masked_mob,
            mobile_encrypted=enc_mobile,
            aadhaar_masked=masked_adh,
            aadhaar_encrypted=enc_aadhaar,
            gender=gender,
            age=age,
            course=course,
            training_provider=provider,
            district=district,
            state="Telangana / Andhra Pradesh",
            cohort=cohort,
            employment_status=status,
            job_role=job_role,
            employer_name=employer_name,
            baseline_wage=base_wage,
            wage_m3=w_m3,
            wage_m6=w_m6,
            wage_m12=w_m12,
            current_wage=current_w,
            retention_status=retention,
            attrition_reason=attrition_reason,
            remedial_flag=remedial_flag,
            remedial_notes=remedial_notes,
            ai_attrition_risk_score=pred["risk_score"],
            ai_risk_level=pred["risk_level"],
            consent_given=True,
            consent_timestamp=consent_dt,
            created_at=consent_dt
        )
        db.add(trainee)

        # DPDP Consent Log
        consent_text = "I consent to my training and demographic data being linked with employment and longitudinal wage outcomes for 12 months under DPDP Act 2023."
        c_hash = generate_consent_hash(t_id, consent_text, consent_dt.isoformat(), "10.0.4.12")
        consent_log = ConsentLog(
            trainee_id=t_id,
            consent_text=consent_text,
            consent_version="v1.2-DPDP2023",
            ip_address=f"49.204.{random.randint(10, 240)}.{random.randint(10, 240)}",
            user_agent="SkillTrack PWA / Android 14",
            timestamp=consent_dt,
            tamper_hash=c_hash
        )
        db.add(consent_log)

        # 4. Follow-up responses simulation (3M, 6M, 12M) - ~70% response rate
        milestones = [("3M", 90, w_m3), ("6M", 180, w_m6), ("12M", 360, w_m12)]
        for ms_name, days_ago, wage_val in milestones:
            # 70% response rate simulation
            received = random.random() < 0.72
            f_resp = FollowUpResponse(
                trainee_id=t_id,
                milestone=ms_name,
                channel="WhatsApp" if random.random() < 0.8 else "SMS",
                sent_timestamp=consent_dt + datetime.timedelta(days=days_ago),
                response_received=received,
                response_timestamp=(consent_dt + datetime.timedelta(days=days_ago, hours=random.randint(1, 24))) if received else None,
                reported_status=status if received else None,
                reported_wage=wage_val if (received and status != "Unemployed") else 0.0,
                attrition_reason=attrition_reason if (received and status == "Unemployed") else None,
                raw_chat_log=f"Bot: Hi {first_name}, SkillTrack 12M Survey check: Employed? | User: {'Yes, salary is ₹' + str(int(wage_val)) if status != 'Unemployed' else 'No, reason: ' + str(attrition_reason)}" if received else "No reply within 72h window.",
                flagged_for_action=remedial_flag
            )
            db.add(f_resp)

        # 5. Self-employment record if applicable
        if status == "Self-Employed":
            se_rec = SelfEmploymentRecord(
                trainee_id=t_id,
                business_name=f"{first_name}'s {course} Enterprises",
                business_type=f"{course} & Allied Services",
                udyam_reg_number=f"UDYAM-TS-0{random.randint(1, 9)}-00{random.randint(10000, 99999)}",
                gst_number=f"36{first_name[:4].upper()}1290K1Z{random.randint(1, 9)}",
                monthly_revenue=round(w_m12 * random.uniform(1.2, 1.8), -2),
                proof_document_type="Udyam Registration Certificate",
                proof_file=f"udyam_cert_{t_id}.pdf",
                verification_status="Verified",
                created_at=consent_dt + datetime.timedelta(days=30)
            )
            db.add(se_rec)

    # 6. Seed initial audit log events
    audit_events = [
        AuditLog(
            user_identity="system_seeder",
            role="Admin",
            action="INITIAL_SEED",
            entity_type="System",
            entity_id="ALL",
            details="Seeded 100 synthetic longitudinal trainee records compliant with MSDE outcome tracking standard.",
            ip_address="127.0.0.1",
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(days=1)
        ),
        AuditLog(
            user_identity="admin",
            role="Admin",
            action="VERIFY_EMPLOYER_BATCH",
            entity_type="Employer",
            entity_id="8_EMPLOYERS",
            details="Validated GST/Udyam credentials and committed verification hashes to blockchain ledger.",
            ip_address="192.168.1.10",
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(hours=12)
        )
    ]
    db.add_all(audit_events)

    db.commit()
    db.close()
    print("[SUCCESS] Database successfully seeded with 100 Trainees, Employers, Follow-ups, and DPDP Consent records!")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Create उद्यम Track fictional demo records.")
    parser.add_argument("--reset", action="store_true",
                        help="Back up SQLite, then replace ALL existing data with the demo dataset.")
    seed_database(reset=parser.parse_args().reset)
