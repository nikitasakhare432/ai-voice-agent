from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException

from app.models.call import Call
from app.utils.deps import get_db, get_current_user
from app.schemas.call import CallCreate, CallSchedule, CallResponse



router = APIRouter()

@router.post("/", response_model=CallResponse)
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
    request: CallSchedule,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    call = Call(
        agent_id=request.agent_id,
        workspace_id=current_user.workspace_id,
        status="scheduled",
        direction="outbound",
        phone_number=request.phone_number,
        scheduled_at=request.scheduled_at
    )

    db.add(call)
    db.commit()

    return {"message": "Call scheduled"}

@router.get("/", response_model=list[CallResponse])
def get_calls(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    calls = db.query(Call).filter(
        Call.workspace_id == current_user.workspace_id
    ).all()

    return calls

@router.delete("/scheduled/{call_id}")
def cancel_scheduled_call(call_id: int, db: Session = Depends(get_db)):
    call = db.query(Call).filter(Call.id == call_id).first()

    if not call:
        raise HTTPException(status_code=404, detail="Call not found")

    if call.status == "completed":
        raise HTTPException(status_code=400, detail="Cannot cancel completed call")

    call.status = "cancelled"
    db.commit()

    return {"message": "Call cancelled successfully"}