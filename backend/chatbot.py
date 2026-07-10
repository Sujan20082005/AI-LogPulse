from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print("API Key:", api_key)

client = genai.Client(api_key=api_key)

SYSTEM_PROMPT = """
You are AI LogPulse Assistant.

Explain everything simply.
Help beginners.
Explain logs.
Explain programming.
"""

def ask_ai(question: str):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"{SYSTEM_PROMPT}\n\nUser: {question}"
    )

    return response.text