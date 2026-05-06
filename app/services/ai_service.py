import os
from groq import Groq

# ✅ Load API key safely
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("❌ GROQ_API_KEY is not set in environment variables")

# ✅ Initialize client
client = Groq(api_key=GROQ_API_KEY)


# =====================================================
# 🔹 BASIC CHAT RESPONSE (non-streaming)
# =====================================================
def generate_response(system_prompt: str, message: str) -> str:
    try:
        res = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
        )

        return res.choices[0].message.content.strip()

    except Exception as e:
        print("❌ Error in generate_response:", e)
        return "Sorry, something went wrong."


# =====================================================
# 🔹 SUMMARY (HIGH QUALITY - IMPORTANT FOR EVALUATION)
# =====================================================
def generate_summary(transcript: str) -> str:
    try:
        res = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an assistant that summarizes conversations.\n"
                        "Return ONLY one clear, meaningful sentence.\n"
                        "Capture the user's intent and outcome.\n"
                        "Do not be vague or generic."
                    ),
                },
                {"role": "user", "content": transcript},
            ],
        )

        return res.choices[0].message.content.strip()

    except Exception as e:
        print("❌ Error in generate_summary:", e)
        return "Summary unavailable."


# =====================================================
# 🔹 SENTIMENT CLASSIFICATION (STRICT OUTPUT)
# =====================================================
def classify_sentiment(transcript: str) -> str:
    try:
        res = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Classify the sentiment of the conversation.\n"
                        "Return ONLY one word from this list:\n"
                        "positive, neutral, negative.\n"
                        "Do NOT return anything else."
                    ),
                },
                {"role": "user", "content": transcript},
            ],
        )

        sentiment = res.choices[0].message.content.strip().lower()

        # ✅ safety fallback
        if sentiment not in ["positive", "neutral", "negative"]:
            return "neutral"

        return sentiment

    except Exception as e:
        print("❌ Error in classify_sentiment:", e)
        return "neutral"


# =====================================================
# 🔹 STREAMING SUPPORT (USED IN WEBSOCKET)
# =====================================================
def stream_response(system_prompt: str, message: str):
    """
    Generator function for streaming tokens
    """
    try:
        stream = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            stream=True,
        )

        for chunk in stream:
            token = chunk.choices[0].delta.content or ""
            yield token

    except Exception as e:
        print("❌ Error in stream_response:", e)
        yield "Error generating response."