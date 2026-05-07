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

```bash
AI-Voice-Agent-Platform/
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── database/
│   ├── utils/
│   ├── scheduler/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── api/
│   │   ├── routes/
│   │   └── App.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── screenshots/
├── README.md
└── .env

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

# Screenshots

## Register

<img width="1896" height="801" alt="Screenshot 2026-05-07 152951" src="https://github.com/user-attachments/assets/c17ab9a6-d754-47f7-b5cf-ef2c4f83a02a" />


---

## Agent Management

\<img width="1905" height="799" alt="Screenshot 2026-05-07 153022" src="https://github.com/user-attachments/assets/987e45c8-9a00-4bd6-8323-f103f10e76b2" />


---

## AI Test Chat

<img width="1890" height="764" alt="Screenshot 2026-05-07 153103" src="https://github.com/user-attachments/assets/fff823d2-1d50-40c3-88c2-ec0e0de84031" />


---

## Call Logs


<img width="1895" height="775" alt="Screenshot 2026-05-07 153405" src="https://github.com/user-attachments/assets/6b4febb3-8763-40ea-91ac-e75a22aecb87" />


---

## Scheduled Calls

<img width="1889" height="761" alt="Screenshot 2026-05-07 153440" src="https://github.com/user-attachments/assets/7fd1ba6c-8d05-4091-a05a-eed2e56d4522" />


---

## Analytics Dashboard

<img width="1911" height="779" alt="Screenshot 2026-05-07 153459" src="https://github.com/user-attachments/assets/e42a4fe3-2ad2-45af-9d3c-50b73ca9ce7b" />

