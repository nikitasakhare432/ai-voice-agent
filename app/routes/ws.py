from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.agent import Agent
from app.models.call import Call
from app.models.call_turn import CallTurn
from app.services.ai_service import client

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.websocket("/chat/{agent_id}")
async def websocket_chat(websocket: WebSocket, agent_id: int):
    await websocket.accept()

    db = SessionLocal()

    try:
        while True:
            user_message = await websocket.receive_text()

            agent = db.query(Agent).filter(Agent.id == agent_id).first()

            if not agent:
                await websocket.send_text("Agent not found")
                continue

            # create call
            call = Call(
                agent_id=agent.id,
                workspace_id=agent.workspace_id,
                status="initiated",
                direction="inbound"
            )
            db.add(call)
            db.commit()
            db.refresh(call)

            full_response = ""

            # 🔥 STREAM FROM GROQ
            stream = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": agent.system_prompt},
                    {"role": "user", "content": user_message}
                ],
                stream=True
            )

            for chunk in stream:
                token = chunk.choices[0].delta.content or ""
                full_response += token

                await websocket.send_text(token)

            # save turns
            db.add(CallTurn(call_id=call.id, role="user", message=user_message))
            db.add(CallTurn(call_id=call.id, role="assistant", message=full_response))

            # transcript
            transcript = f"User: {user_message}\nAI: {full_response}"

            # 🔥 AI ANALYSIS
            summary = generate_summary(transcript)
            sentiment = classify_sentiment(transcript)

            # update call
            db.query(Call).filter(Call.id == call.id).update({
                "transcript": transcript,
                "summary": summary,
                "sentiment": sentiment,
                "status": "completed"
            })

            db.commit()

            # optional: notify frontend end of stream
            await websocket.send_text("[END]")

    except WebSocketDisconnect:
        db.close()