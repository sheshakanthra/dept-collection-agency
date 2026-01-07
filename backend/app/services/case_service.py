from sqlalchemy.orm import Session
from app.models.case import Case
from app.models.dca import DCA
from app.services.ai_service import calculate_priority, explain_priority
import random


def auto_assign_dca(db: Session):
    dcas = db.query(DCA).all()
    if not dcas:
        return None
    return random.choice(dcas).id


def create_case(db: Session, data: dict, performed_by: str = "System"):
    assigned_dca_id = auto_assign_dca(db)

    priority, recovery_probability = calculate_priority(
        data["amount_due"],
        data["ageing_days"]
    )

    explanation_list = explain_priority(
        data["amount_due"],
        data["ageing_days"]
    )

    case = Case(
        case_id=data["case_id"],
        customer_name=data["customer_name"],
        amount_due=data["amount_due"],
        ageing_days=data["ageing_days"],
        priority=priority,
        recovery_probability=recovery_probability,
        explanation="; ".join(explanation_list),
        status="Open",
        assigned_dca_id=assigned_dca_id,
        sla_hours=data.get("sla_hours", 48)
    )

    db.add(case)
    
    # Auto-log audit
    from app.models.audit import AuditLog
    audit = AuditLog(
        entity="Case",
        entity_id=case.case_id,
        action=f"Case Created (Priority: {priority})",
        performed_by=performed_by
    )
    db.add(audit)

    db.commit()
    db.refresh(case)
    return case
