from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.users import User
from app.models.workspace import Workspace
from app.utils.security import hash_password, verify_password
from app.utils.jwt import create_access_token
from app.utils.deps import get_current_user
from app.schemas.auth import LoginRequest, RegisterRequest

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    workspace = Workspace(name=data.workspace_name)
    db.add(workspace)
    db.commit()
    db.refresh(workspace)

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        workspace_id=workspace.id
    )
    db.add(user)
    db.commit()

    token = create_access_token({"user_id": user.id})
    return {"access_token": token}

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"user_id": user.id})
    return {"access_token": token}