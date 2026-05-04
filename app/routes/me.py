from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.utils.deps import get_db, get_current_user
from app.models.workspace import Workspace

# ✅ THIS WAS MISSING
router = APIRouter()

@router.get("/")
def get_me(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    workspace = db.query(Workspace).filter(
        Workspace.id == current_user.workspace_id
    ).first()

    return {
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "display_name": current_user.email.split("@")[0]
        },
        "workspace": {
            "id": workspace.id if workspace else None,
            "name": workspace.name if workspace else "No Workspace"
        }
    }