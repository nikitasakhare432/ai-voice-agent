from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.agent import Agent
from app.utils.deps import get_db, get_current_user
from app.services.ai_service import generate_response
from app.models.call import Call
from app.models.call_turn import CallTurn

router = APIRouter()

@router.post("/")
def create_agent(
    name: str,
    system_prompt: str,
    voice: str,
    language: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    agent = Agent(
        name=name,
        system_prompt=system_prompt,
        voice=voice,
        language=language,
        workspace_id=current_user.workspace_id
    )

    db.add(agent)
    db.commit()
    db.refresh(agent)

    return agent
@router.get("/")
def get_agents(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    agents = db.query(Agent).filter(
        Agent.workspace_id == current_user.workspace_id
    ).all()

    return agents

@router.get("/{agent_id}")
def get_agent(
    agent_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    agent = db.query(Agent).filter(
        Agent.id == agent_id,
        Agent.workspace_id == current_user.workspace_id
    ).first()

    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    return agent
@router.put("/{agent_id}")
def update_agent(
    agent_id: int,
    name: str,
    system_prompt: str,
    voice: str,
    language: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    agent = db.query(Agent).filter(
        Agent.id == agent_id,
        Agent.workspace_id == current_user.workspace_id
    ).first()

    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    agent.name = name
    agent.system_prompt = system_prompt
    agent.voice = voice
    agent.language = language

    db.commit()

    return {"message": "Agent updated"}

@router.delete("/{agent_id}")
def delete_agent(
    agent_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    agent = db.query(Agent).filter(
        Agent.id == agent_id,
        Agent.workspace_id == current_user.workspace_id
    ).first()

    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    db.delete(agent)
    db.commit()

    return {"message": "Agent deleted"}

@router.post("/{agent_id}/chat")
def chat_with_agent(
    agent_id: int,
    message: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    agent = db.query(Agent).filter(
        Agent.id == agent_id,
        Agent.workspace_id == current_user.workspace_id
    ).first()

    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    # create call
    call = Call(
        agent_id=agent.id,
        workspace_id=current_user.workspace_id,
        status="initiated",
        direction="inbound"
    )
    db.add(call)
    db.commit()
    db.refresh(call)

    # save user message
    user_turn = CallTurn(
        call_id=call.id,
        role="user",
        message=message
    )
    db.add(user_turn)

    # get AI response
    ai_response = generate_response(agent.system_prompt, message)

    # save AI response
    ai_turn = CallTurn(
        call_id=call.id,
        role="assistant",
        message=ai_response
    )
    db.add(ai_turn)

    call.transcript = f"User: {message}\nAI: {ai_response}"
    call.status = "completed"

    db.commit()

    return {
        "response": ai_response,
        "call_id": call.id
    }