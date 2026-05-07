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
```

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

```env
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
GROQ_API_KEY=your_groq_api_key
```

## Frontend (.env)

```env
VITE_API_URL=https://your-backend-url.railway.app
```

---

# Installation

## Backend Setup

```bash
git clone <repo-url>

cd backend

pip install -r requirements.txt

alembic upgrade head

uvicorn main:app --reload
```

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# Scheduler

The application uses APScheduler for outbound call simulation.

Features:
- Runs independently
- Checks scheduled calls every 60 seconds
- Executes asynchronous AI conversations
- Prevents crashes using error handling

---

# Deployment

## Backend
Deployed on Railway.

## Frontend
Deployed on Vercel.

---

# Author

Nikita Sakhare
