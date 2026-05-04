from pydantic import BaseModel


# 👉 Request schema (what frontend sends)
class AgentCreate(BaseModel):
    name: str
    system_prompt: str
    voice: str
    language: str


# 👉 Response schema (what backend returns)

class AgentUpdate(BaseModel):
    name: str
    system_prompt: str
    voice: str
    language: str
    
class AgentResponse(BaseModel):
    id: int
    name: str
    system_prompt: str
    voice: str
    language: str
    workspace_id: int

    class Config:
        from_attributes = True   # (Pydantic v2 replacement for orm_mode)