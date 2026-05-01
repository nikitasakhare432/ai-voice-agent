from fastapi import FastAPI
from app.db.database import engine, Base

# import models (IMPORTANT for table creation)
from app.models import users, workspace, agent, call, call_turn

# import routes
from app.routes import auth, agents, calls

# create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Backend running"}

# include routers
app.include_router(auth.router, prefix="/auth")
app.include_router(agents.router, prefix="/agents", tags=["Agents"])
app.include_router(calls.router, prefix="/calls", tags=["Calls"])