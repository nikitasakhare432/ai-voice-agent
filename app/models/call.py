from sqlalchemy import Column, Integer, String, ForeignKey, Text
from app.db.database import Base
from sqlalchemy import DateTime

class Call(Base):
    __tablename__ = "calls"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"))
    workspace_id = Column(Integer)
    status = Column(String)
    direction = Column(String)
    transcript = Column(Text)
    summary = Column(Text)
    sentiment = Column(String)
    scheduled_at = Column(DateTime, nullable=True)
    started_at = Column(DateTime, nullable=True)
    ended_at = Column(DateTime, nullable=True)
    phone_number = Column(String, nullable=True)