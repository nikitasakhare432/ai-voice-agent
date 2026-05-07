from datetime import datetime
from app.db.database import SessionLocal
from app.models.call import Call
from app.models.agent import Agent
from app.services.ai_service import (
    generate_response,
    generate_summary,
    classify_sentiment
)

import time
import threading

is_running = False


def simulate_call(call, db):
    agent = db.query(Agent).filter(Agent.id == call.agent_id).first()
    if not agent:
        return

    start_time = datetime.utcnow()

    conversation = []
    user_msg = "Hello"

    for _ in range(3):
        ai_reply = generate_response(agent.system_prompt, user_msg)

        conversation.append(f"User: {user_msg}")
        conversation.append(f"AI: {ai_reply}")

        user_msg = "Can you explain more?"

    transcript = "\n".join(conversation)
    end_time = datetime.utcnow()

    call.transcript = transcript
    call.summary = generate_summary(transcript)
    call.sentiment = classify_sentiment(transcript)

    call.started_at = start_time
    call.ended_at = end_time
    call.status = "completed"


def scheduler_loop():
    global is_running
    is_running = True

    print("🚀 Scheduler started...")

    while True:
        db = SessionLocal()
        try:
            now = datetime.utcnow()

            print("🔍 Checking scheduled calls:", now)

            calls = db.query(Call).filter(
                Call.status == "scheduled",
                Call.scheduled_at <= now
            ).all()

            for call in calls:
                print(f"📞 Running call ID: {call.id}")

                call.status = "processing"
                db.commit()

                simulate_call(call, db)

            db.commit()

        except Exception as e:
            print("❌ Scheduler error:", e)

        finally:
            db.close()

        time.sleep(15)  # check every 15 sec


def start_scheduler():
    thread = threading.Thread(target=scheduler_loop, daemon=True)
    thread.start()