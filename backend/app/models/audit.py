from sqlalchemy import Column, Integer, String
from app.db.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    entity = Column(String)       # Case / User / SLA
    entity_id = Column(String)
    action = Column(String)       # Created / Updated / Escalated
    performed_by = Column(String)
