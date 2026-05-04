from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.database import SessionLocal
from app.models.agent import Agent
from app.models.call import Call
from app.models.call_turn import CallTurn
from app.services.ai_service import client, generate_summary, classify_sentiment

router = APIRouter()

@router.websocket("/chat/{agent_id}")
async def websocket_chat(websocket: WebSocket, agent_id: int):
    await websocket.accept()
    db = SessionLocal()

    try:
        # ✅ get agent once
        agent = db.query(Agent).filter(Agent.id == agent_id).first()

        if not agent:
            await websocket.send_text("Agent not found")
            await websocket.close()
            return

        # ✅ create call once
        call = Call(
            agent_id=agent.id,
            workspace_id=agent.workspace_id,
            status="initiated",
            direction="inbound",
            started_at=datetime.utcnow()
        )
        db.add(call)
        db.commit()
        db.refresh(call)

        transcript_parts = []

        while True:
            user_message = await websocket.receive_text()

            full_response = ""

            # 🔥 stream
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

            transcript_parts.append(f"User: {user_message}")
            transcript_parts.append(f"AI: {full_response}")

            db.commit()

            await websocket.send_text("[END]")

    except WebSocketDisconnect:
        # ✅ finalize conversation
        transcript = "\n".join(transcript_parts)

        summary = generate_summary(transcript)
        sentiment = classify_sentiment(transcript)

        db.query(Call).filter(Call.id == call.id).update({
            "transcript": transcript,
            "summary": summary,
            "sentiment": sentiment,
            "status": "completed",
            "ended_at": datetime.utcnow()
        })

        db.commit()

    finally:
        db.close()