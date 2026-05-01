from fastapi import FastAPI
from app.db.database import engine, Base
from app.routes import auth
from app.models import agent
from app.routes import agents

# import models
from app.models import users, workspace
from app.models import call, call_turn
from app.routes import calls

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Backend running"}
app.include_router(auth.router, prefix="/auth")
app.include_router(agents.router, prefix="/agents", tags=["Agents"])
app.include_router(calls.router, prefix="/calls", tags=["Calls"])