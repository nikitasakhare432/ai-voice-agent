from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.call import Call
from app.utils.deps import get_db, get_current_user
from app.schemas.call import CallCreate

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