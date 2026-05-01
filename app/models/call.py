from sqlalchemy import Column, Integer, String, ForeignKey, Text
from app.db.database import Base

class Call(Base):
    __tablename__ = "calls"

    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    agent_id = Column(Integer, ForeignKey("agents.id"))

    direction = Column(String)  # inbound / outbound
    status = Column(String)     # initiated / completed / failed

    transcript = Column(Text)
    summary = Column(String)
    sentiment = Column(String)

    duration = Column(Integer)