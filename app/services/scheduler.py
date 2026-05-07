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

# =====================================================
# PREVENT MULTIPLE THREADS
# =====================================================

is_running = False


# =====================================================
# SIMULATE AI CALL
# =====================================================

def simulate_call(call, db):

    agent = db.query(Agent).filter(
        Agent.id == call.agent_id
    ).first()

    if not agent:
        print(f"❌ Agent not found for call {call.id}")
        return

    print(f"🚀 Starting AI simulation for call {call.id}")

    start_time = datetime.utcnow()

    conversation = []

    # -------------------------------------------------
    # Simulated User Side
    # -------------------------------------------------

    user_messages = [
        "Hello",
        "Can you explain your services?",
        "What pricing plans do you offer?"
    ]

    # -------------------------------------------------
    # Generate AI Responses
    # -------------------------------------------------

    for msg in user_messages:

        ai_reply = generate_response(
            agent.system_prompt,
            msg
        )

        conversation.append(f"User: {msg}")
        conversation.append(f"AI: {ai_reply}")

    # -------------------------------------------------
    # Create Transcript
    # -------------------------------------------------

    transcript = "\n".join(conversation)

    end_time = datetime.utcnow()

    # -------------------------------------------------
    # Save Call Data
    # -------------------------------------------------

    call.transcript = transcript

    call.summary = generate_summary(transcript)

    call.sentiment = classify_sentiment(transcript)

    call.started_at = start_time
    call.ended_at = end_time

    call.status = "completed"

    db.commit()

    print(f"✅ Call completed: {call.id}")


# =====================================================
# MAIN SCHEDULER LOOP
# =====================================================

def scheduler_loop():

    global is_running

    is_running = True

    print("🚀 Scheduler started...")

    while True:

        db = SessionLocal()

        try:

            now = datetime.utcnow()

            print("🔍 Checking scheduled calls:", now)

            # -------------------------------------------------
            # Find Due Calls
            # -------------------------------------------------

            calls = db.query(Call).filter(
                Call.status == "scheduled",
                Call.scheduled_at <= now
            ).all()

            print(f"📞 Calls found: {len(calls)}")

            # -------------------------------------------------
            # Run Each Call
            # -------------------------------------------------

            for call in calls:

                print(f"📞 Running call ID: {call.id}")

                # prevent duplicate execution
                call.status = "processing"

                db.commit()

                # simulate AI conversation
                simulate_call(call, db)

        except Exception as e:

            print("❌ Scheduler error:", e)

        finally:

            db.close()

        # -------------------------------------------------
        # Check Every 15 Seconds
        # -------------------------------------------------

        time.sleep(15)


# =====================================================
# START SCHEDULER THREAD
# =====================================================

def start_scheduler():

    global is_running

    if is_running:
        print("⚠️ Scheduler already running")
        return

    print("🚀 Starting scheduler thread...")

    thread = threading.Thread(
        target=scheduler_loop,
        daemon=True
    )

    thread.start()