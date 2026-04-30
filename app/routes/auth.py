from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.users import User
from app.models.workspace import Workspace
from app.utils.security import hash_password, verify_password
from app.utils.jwt import create_access_token
from app.utils.deps import get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(email: str, password: str, workspace_name: str, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    workspace = Workspace(name=workspace_name)
    db.add(workspace)
    db.commit()
    db.refresh(workspace)

    user = User(
        email=email,
        password_hash=hash_password(password),
        workspace_id=workspace.id
    )
    db.add(user)
    db.commit()

    token = create_access_token({"user_id": user.id})
    return {"access_token": token}

@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"user_id": user.id})
    return {"access_token": token}
@router.get("/me")
def get_me(current_user = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "workspace_id": current_user.workspace_id
    }