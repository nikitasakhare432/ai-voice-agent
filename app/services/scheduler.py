from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from app.db.database import SessionLocal
from app.models.call import Call
from app.models.agent import Agent
from app.services.ai_service import (
    generate_response,
    generate_summary,
    classify_sentiment
)

scheduler = BackgroundScheduler()

def simulate_call():
    db = SessionLocal()
    try:
        now = datetime.utcnow()
        print("Scheduler running at:", now)

        # STEP 1: get eligible calls
        calls = db.query(Call).filter(
            Call.status == "scheduled",
            Call.scheduled_at <= now
        ).all()

        for call in calls:

            # STEP 2: double safety check
            if call.status != "scheduled":
                continue

            agent = db.query(Agent).filter(Agent.id == call.agent_id).first()
            if not agent:
                continue

            # STEP 3: mark immediately so it won't run twice
            call.status = "initiated"
            db.commit()

            start_time = datetime.utcnow()

            conversation = []
            user_msg = "Hello"

            for _ in range(3):
                ai_reply = generate_response(agent.system_prompt, user_msg)
                conversation.append(f"User: {user_msg}")
                conversation.append(f"AI: {ai_reply}")
                user_msg = "Can you tell me more?"

            transcript = "\n".join(conversation)
            end_time = datetime.utcnow()

            call.transcript = transcript
            call.summary = generate_summary(transcript)
            call.sentiment = classify_sentiment(transcript)

            call.started_at = start_time
            call.ended_at = end_time
            call.status = "completed"

        db.commit()

    finally:
        db.close()


def start_scheduler():
    if not scheduler.running:
        scheduler.add_job(
            simulate_call,
            "interval",
            seconds=15,
            max_instances=1,
            coalesce=True
        )
        scheduler.start()