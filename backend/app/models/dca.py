from sqlalchemy import Column, Integer, String
from app.db.base import Base

class DCA(Base):
    __tablename__ = "dca_partners"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    region = Column(String)
