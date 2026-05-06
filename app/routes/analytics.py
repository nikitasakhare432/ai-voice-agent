from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from collections import Counter

from app.models.call import Call
from app.utils.deps import get_db, get_current_user

router = APIRouter()

@router.get("/")
def get_analytics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    calls = db.query(Call).filter(
        Call.workspace_id == current_user.workspace_id
    ).all()

    # 📊 Calls per day (last 7 days)
    last_7_days = [(datetime.utcnow() - timedelta(days=i)).date() for i in range(7)]
    calls_per_day = []

    for day in last_7_days[::-1]:
        count = sum(
            1 for c in calls
            if c.started_at and c.started_at.date() == day
        )
        calls_per_day.append({
            "date": str(day),
            "calls": count
        })

    # 🧠 Sentiment breakdown
    sentiments = [c.sentiment for c in calls if c.sentiment]
    sentiment_count = Counter(sentiments)

    sentiment_data = [
        {"name": k, "value": v}
        for k, v in sentiment_count.items()
    ]

    # 📈 Success rate over time
    success_data = []
    for day in last_7_days[::-1]:
        day_calls = [
            c for c in calls
            if c.started_at and c.started_at.date() == day
        ]

        total = len(day_calls)
        completed = len([c for c in day_calls if c.status == "completed"])

        rate = (completed / total * 100) if total > 0 else 0

        success_data.append({
            "date": str(day),
            "rate": round(rate, 2)
        })

    # 🏆 Top agents
    agent_counts = Counter([c.agent_id for c in calls])
    top_agents = [
        {"agent": f"Agent {k}", "calls": v}
        for k, v in agent_counts.most_common(5)
    ]

    return {
        "calls_per_day": calls_per_day,
        "sentiment": sentiment_data,
        "success_rate": success_data,
        "top_agents": top_agents
    }