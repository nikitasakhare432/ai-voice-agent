from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.db.database import Base

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    name = Column(String)
    system_prompt = Column(String)
    voice = Column(String)
    language = Column(String)
    is_active = Column(Boolean, default=True)