from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.rbac import require_role

router = APIRouter(prefix="/audit", tags=["Audit Logs"])

@router.get("/")
def get_audit_logs(
    db: Session = Depends(get_db),
    user=Depends(require_role(["admin", "manager", "analyst"]))
):
    from app.models.audit import AuditLog
    return db.query(AuditLog).all()
