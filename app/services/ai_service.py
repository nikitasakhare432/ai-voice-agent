from groq import Groq
from app.utils.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

def generate_response(system_prompt: str, user_message: str):
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
    )

    return completion.choices[0].message.content

def generate_summary(transcript: str):
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "Summarize the following conversation in one clear sentence."
            },
            {
                "role": "user",
                "content": transcript
            }
        ]
    )

    return completion.choices[0].message.content


def classify_sentiment(transcript: str):
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "Classify the sentiment of this conversation as one of: "
                    "positive, neutral, negative. "
                    "Return ONLY one word."
                )
            },
            {
                "role": "user",
                "content": transcript
            }
        ]
    )

    return completion.choices[0].message.content.strip().lower()