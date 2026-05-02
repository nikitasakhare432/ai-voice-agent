from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.call import Call
from app.utils.deps import get_db, get_current_user
from app.schemas.call import CallCreate
from datetime import datetime

router = APIRouter()

@router.post("/")
def create_call(
    request: CallCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    call = Call(
        agent_id=request.agent_id,
        workspace_id=current_user.workspace_id,
        status="initiated",
        direction="inbound"
    )

    db.add(call)
    db.commit()
    db.refresh(call)

    return call

@router.post("/schedule")
def schedule_call(
    agent_id: int,
    phone_number: str,
    scheduled_at: datetime,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    call = Call(
        agent_id=agent_id,
        workspace_id=current_user.workspace_id,
        status="scheduled",
        direction="outbound",
        phone_number=phone_number,
        scheduled_at=scheduled_at
    )

    db.add(call)
    db.commit()

    return {"message": "Call scheduled"}

@router.get("/")
def get_calls(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    calls = db.query(Call).filter(
        Call.workspace_id == current_user.workspace_id
    ).all()

    return calls