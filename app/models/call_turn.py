from sqlalchemy import Column, Integer, String, ForeignKey, Text
from app.db.database import Base

class CallTurn(Base):
    __tablename__ = "call_turns"

    id = Column(Integer, primary_key=True, index=True)
    call_id = Column(Integer, ForeignKey("calls.id"))

    role = Column(String)  # user / assistant
    message = Column(Text)