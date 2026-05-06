import os
from groq import Groq

def get_client():
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise ValueError("GROQ_API_KEY not set")

    return Groq(api_key=api_key)


def generate_response(system_prompt: str, user_message: str):
    client = get_client()

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
    )

    return completion.choices[0].message.content


def generate_summary(transcript: str):
    client = get_client()

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "Summarize the following conversation in one clear sentence."},
            {"role": "user", "content": transcript}
        ]
    )

    return completion.choices[0].message.content


def classify_sentiment(transcript: str):
    client = get_client()

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "Classify the sentiment as: positive, neutral, or negative. Return ONLY one word."
            },
            {"role": "user", "content": transcript}
        ]
    )

    return completion.choices[0].message.content.strip().lower()