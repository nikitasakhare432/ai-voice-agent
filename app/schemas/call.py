from pydantic import BaseModel

class CallCreate(BaseModel):
    agent_id: int