from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    password_hash = Column(String)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))