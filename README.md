# AI Voice Agent Platform

A full-stack AI Voice Agent Management Platform inspired by Retell AI.  
This platform allows businesses to create AI agents with custom personalities, simulate AI conversations, schedule outbound AI calls, and analyze call activity through dashboards and analytics.

---

# Live Demo

Frontend: https://ai-voice-agent-weld-eight.vercel.app/

Backend: https://web-production-2c269.up.railway.app/

---

# Features

## Authentication
- User registration and login
- JWT authentication
- Protected routes
- Workspace-based multi-tenancy

---

## Dashboard
- Total calls
- Total agents
- Success rate
- Average call duration
- Recent calls
- Top active agents

---

## Agent Management
- Create AI agents
- Edit AI agents
- Soft delete/inactive agents
- Configure:
  - Name
  - Voice
  - Language
  - System Prompt
- Test Chat functionality

---

## AI Chat System
- Real-time chat using WebSockets
- Token streaming responses
- Groq LLM integration
- AI responses based on custom system prompts

---

## Automatic AI Features
After every conversation:
- AI-generated summary
- AI sentiment classification
  - Positive
  - Neutral
  - Negative

---

## Call Logs
- Full transcript history
- Sentiment display
- Summary display
- Expandable conversations
- Status badges
- Direction tracking

---

## Scheduled Outbound Call Simulation
Users can:
- Schedule AI outbound calls
- Set phone number and future time
- Cancel scheduled calls

Scheduler automatically:
- Runs every 60 seconds
- Detects due calls
- Simulates 3-5 turn AI conversations
- Stores transcript
- Generates summary
- Detects sentiment
- Marks call completed

---

## Analytics
- Calls per day
- Sentiment breakdown
- Success rate over time
- Top agents by call volume

Charts built using Recharts with real database data.

---

# Tech Stack

## Frontend
- React.js
- Tailwind CSS
- React Router
- Axios
- Recharts

## Backend
- FastAPI
- SQLAlchemy
- Alembic
- APScheduler

## Database
- SQLite

## AI
- Groq API
- llama-3.3-70b-versatile

## Real-Time
- WebSockets

## Deployment
- Railway (Backend)
- Vercel (Frontend)

---

# Project Structure

backend/
│
├── routes/
├── models/
├── schemas/
├── services/
├── database/
├── utils/
├── scheduler/
└── main.py

frontend/
│
├── src/
│   ├── pages/
│   ├── components/
│   ├── layouts/
│   ├── api/
│   └── routes/

---

# API Endpoints

## Authentication
- POST /auth/register
- POST /auth/login
- GET /me

## Agents
- GET /agents
- POST /agents
- GET /agents/{id}
- PUT /agents/{id}
- DELETE /agents/{id}

## Calls
- GET /calls
- POST /calls
- POST /calls/schedule
- DELETE /calls/scheduled/{id}

## AI
- POST /agents/{id}/chat

## Analytics
- GET /analytics

## WebSocket
- WS /ws/chat/{agent_id}

---

# Environment Variables

## Backend (.env)

DATABASE_URL=sqlite:///./test.db

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=1440

GROQ_API_KEY=your_groq_api_key

---

## Frontend (.env)

VITE_API_URL=https://your-backend-url.railway.app

---

# Installation

## Backend Setup

```bash
git clone <repo-url>

cd backend

pip install -r requirements.txt

alembic upgrade head

uvicorn main:app --reload

# Screenshots

## Register

<p align="center">
  <img src="<img width="1896" height="801" alt="Screenshot 2026-05-07 152951" src="https://github.com/user-attachments/assets/aa59a542-18b3-4f7d-9f78-7cfff52dc2a0" />
" />
</p>

---

## Agent Management

<p align="center">
  <img src="<img width="1905" height="799" alt="Screenshot 2026-05-07 153022" src="https://github.com/user-attachments/assets/6c687e34-964f-43ae-aba5-e9e72c942bb2" />" />
 
</p>

---

## AI Test Chat

<p align="center">
  <img src="<img width="1890" height="764" alt="Screenshot 2026-05-07 153103" src="https://github.com/user-attachments/assets/8a05301c-ab0e-417c-ab52-3f932f13a446" />" />
</p>

---

## Call Logs

<p align="center">
  <img src="<img width="1895" height="775" alt="Screenshot 2026-05-07 153405" src="https://github.com/user-attachments/assets/7ca5da78-77d0-4dac-a1e9-dc30652da8df" />" />
</p>

---

## Scheduled Calls

<p align="center">
  <img src="<img width="1889" height="761" alt="Screenshot 2026-05-07 153440" src="https://github.com/user-attachments/assets/80a45370-a308-422b-a8a3-fabf4742bc0b" />
" />
</p>

---

## Analytics Dashboard

<p align="center">
  <img src="<img width="1911" height="779" alt="Screenshot 2026-05-07 153459" src="https://github.com/user-attachments/assets/1c322005-7e95-41d6-8565-73ee62f701df" />
" />
</p>
