from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.case import Case
from app.models.audit import AuditLog
from datetime import datetime
import random

def seed_data():
    db = SessionLocal()
    
    # 1. Clear existing data (optional, for safety)
    # db.query(Case).delete()
    # db.query(AuditLog).delete()

    print("🌱 Seeding Cases...")
    
    customers = [
        ("John Doe", 500.0, 45, "High"),
        ("Alice Smith", 1200.50, 90, "High"),
        ("Bob Johnson", 300.0, 15, "Low"),
        ("Emma Wilson", 750.0, 60, "Medium"),
        ("Michael Brown", 2200.0, 120, "High"),
        ("Sarah Davis", 150.0, 10, "Low"),
        ("David Miller", 600.0, 35, "Medium"),
        ("James Taylor", 4500.0, 150, "High"),
    ]

    for name, amount, days, priority in customers:
        case = Case(
            case_id=f"CASE-{random.randint(1000, 9999)}",
            customer_name=name,
            amount_due=amount,
            ageing_days=days,
            priority=priority,
            recovery_probability=random.uniform(0.3, 0.9),
            status="Open",
            sla_hours=48 if priority == "High" else 72,
            explanation=f"Customer has pending due of from {days} days."
        )
        db.add(case)
        
        # Add audit log for creation
        audit = AuditLog(
            entity="Case",
            entity_id=case.case_id,
            action="Created",
            performed_by="System Seeder"
        )
        db.add(audit)

    db.commit()
    print("✅ Seeded 8 cases and audit logs.")
    db.close()

if __name__ == "__main__":
    seed_data()
