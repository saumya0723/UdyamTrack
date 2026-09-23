"""Apply fictional names to the shipped demo records; back up any existing database first."""
import datetime
import json
import sqlite3
from pathlib import Path
from backend.security import encrypt_pii

ROOT = Path(__file__).resolve().parent

def main():
    database = ROOT / "skilltrack.db"
    mapping = json.loads((ROOT / "demo_names.json").read_text(encoding="utf-8"))
    if not database.exists():
        raise SystemExit("skilltrack.db was not found beside this script.")
    backup = database.with_name("skilltrack.before_names." + datetime.datetime.now().strftime("%Y%m%d_%H%M%S_%f") + ".db")
    db = sqlite3.connect(database)
    with sqlite3.connect(backup) as copy:
        db.backup(copy)
    changed_people = changed_companies = 0
    with db:
        for person in mapping["trainees"]:
            row = db.execute("SELECT name FROM trainees WHERE id=?", (person["id"],)).fetchone()
            if not row or row[0] != person["old_name"]:
                continue
            db.execute("UPDATE trainees SET name=?,name_encrypted=? WHERE id=?",
                       (person["name"], encrypt_pii(person["name"]), person["id"]))
            for rid, text in db.execute("SELECT id,raw_chat_log FROM follow_up_responses WHERE trainee_id=?", (person["id"],)).fetchall():
                if text:
                    db.execute("UPDATE follow_up_responses SET raw_chat_log=? WHERE id=?",
                               (text.replace(person["old_name"], person["name"]), rid))
            for rid, business in db.execute("SELECT id,business_name FROM self_employment_records WHERE trainee_id=?", (person["id"],)).fetchall():
                old_prefix = person["old_name"].split()[0] + "'s"
                new_prefix = person["name"].split()[0] + "'s"
                db.execute("UPDATE self_employment_records SET business_name=? WHERE id=?",
                           (business.replace(old_prefix, new_prefix), rid))
            changed_people += 1
        for employer in mapping["employers"]:
            old = employer["old_name"]
            row = db.execute("SELECT company_name FROM employers WHERE id=?", (employer["id"],)).fetchone()
            if not row or row[0] != old:
                continue
            fields = ["company_name", "contact_person", "contact_email", "contact_phone", "gst_number", "udyam_number"]
            db.execute("UPDATE employers SET " + ",".join(f+"=?" for f in fields) + " WHERE id=?",
                       [employer[f] for f in fields] + [employer["id"]])
            db.execute("UPDATE trainees SET employer_name=? WHERE employer_name=?", (employer["company_name"], old))
            db.execute("UPDATE users SET organization=? WHERE organization IN (?,?)",
                       (employer["company_name"], old, old.replace(" (L&T)", "")))
            changed_companies += 1
    assert db.execute("PRAGMA integrity_check").fetchone()[0] == "ok"
    assert not db.execute("PRAGMA foreign_key_check").fetchall()
    db.close()
    print(f"Updated {changed_people} trainee names and {changed_companies} companies.")
    print(f"Backup saved as {backup.name}. Restart the backend and refresh your browser.")
    print("Unmatched/custom records are left unchanged; rerunning will not rename already updated records.")

if __name__ == "__main__":
    main()
