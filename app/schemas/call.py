from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# 🔹 Create Call
class CallCreate(BaseModel):
    agent_id: int


# 🔹 Schedule Call
class CallSchedule(BaseModel):
    agent_id: int
    phone_number: str
    scheduled_at: datetime


# 🔹 Response Schema (VERY IMPORTANT)
class CallResponse(BaseModel):
    id: int
    agent_id: int
    workspace_id: int
    status: str
    direction: str

    transcript: Optional[str] = None
    summary: Optional[str] = None
    sentiment: Optional[str] = None

    phone_number: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None

    class Config:
        from_attributes = True   # for SQLAlchemy (Pydantic v2)