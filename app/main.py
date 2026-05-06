from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware   # ✅ ADD THIS

from app.db.database import engine, Base

# import models
from app.models import users, workspace, agent, call, call_turn

# import routes
from app.routes import auth, agents, calls
from app.routes import ws
from app.services.scheduler import start_scheduler
from app.routes import me
from app.routes import analytics


# create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# ✅ ADD CORS MIDDLEWARE HERE
import os

origins = [
    "http://localhost:5173",
    "https://your-frontend.vercel.app",  # 👉 replace later
]

# allow all for now (safe for assignment)
if os.getenv("ENV") == "production":
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # or ["*"] for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    start_scheduler()

@app.get("/")
def root():
    return {"message": "Backend running"}

# include routers
app.include_router(auth.router, prefix="/auth")
app.include_router(agents.router, prefix="/agents", tags=["Agents"])
app.include_router(calls.router, prefix="/calls", tags=["Calls"])
app.include_router(me.router, prefix="/me", tags=["Me"])
app.include_router(ws.router, prefix="/ws")
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])