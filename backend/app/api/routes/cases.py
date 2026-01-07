from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.services.case_service import create_case
from app.core.rbac import require_role
from app.models.case import Case


router = APIRouter(prefix="/cases", tags=["Cases"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def create_new_case(
    payload: dict,
    db: Session = Depends(get_db),
    user=Depends(require_role(["admin", "manager"]))
):
    # Pass generic user identifier if dict, or username if object
    username = user.get("sub") if isinstance(user, dict) else user.username 
    return create_case(db, payload, performed_by=username)


@router.get("/")
def list_cases(
    db: Session = Depends(get_db),
    user=Depends(require_role(["admin", "manager", "analyst"]))
):
    return db.query(Case).all()

