from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.rbac import require_role

router = APIRouter(prefix="/dca", tags=["DCA Agent"])

@router.post("/analyze")
def analyze_case(
    payload: dict,
    user=Depends(require_role(["admin", "manager", "analyst"]))
):
    return {"message": "DCA analysis started", "user": user["sub"]}
