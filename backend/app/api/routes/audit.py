from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.rbac import require_role

router = APIRouter(prefix="/audit", tags=["Audit Logs"])

@router.get("/")
def get_audit_logs(
    user=Depends(require_role(["admin"]))
):
    return {"message": "Audit logs retrieval", "user": user["sub"]}
