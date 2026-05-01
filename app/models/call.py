from sqlalchemy import Column, Integer, String, ForeignKey, Text
from app.db.database import Base

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