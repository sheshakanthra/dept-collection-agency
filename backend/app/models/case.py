from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.db.base import Base
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text

class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String, unique=True, index=True)

    customer_name = Column(String)
    amount_due = Column(Float)
    ageing_days = Column(Integer)

    priority = Column(String)  # Low / Medium / High (AI generated)
    recovery_probability = Column(Float)

    status = Column(String)  # Open / In Progress / Closed / Escalated

    assigned_dca_id = Column(Integer, ForeignKey("dca_partners.id"))
    sla_hours = Column(Integer)

    explanation = Column(Text)