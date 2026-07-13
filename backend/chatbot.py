from google import genai
from dotenv import load_dotenv
import os

# -----------------------------------
# Load Environment Variables
# -----------------------------------

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("❌ GEMINI_API_KEY not found in .env")

client = genai.Client(api_key=api_key)

# -----------------------------------
# AI System Prompt
# -----------------------------------

SYSTEM_PROMPT = """
You are AI LogPulse Assistant.

Behave like ChatGPT.

Rules:

- Give concise answers.
- Maximum 3-4 sentences.
- Don't introduce yourself.
- Don't explain in detail unless the user asks.
- Use simple English.
- Answer directly.
- If code is requested, provide only the necessary code.
"""

# -----------------------------------
# AI Chat Function
# -----------------------------------

def ask_ai(question: str):

    original_question = question.strip()
    lower_question = original_question.lower()

    # -----------------------------
    # Greeting Detection
    # -----------------------------

    greetings = [
        "hi",
        "hello",
        "hey",
        "hii",
        "hiii",
        "good morning",
        "good afternoon",
        "good evening",
        "good night",
        "how are you",
        "what's up",
        "whats up"
    ]

    if any(lower_question == greeting for greeting in greetings):
        return "Hi! 👋 How can I help you today?"

    # -----------------------------
    # Decide Answer Length
    # -----------------------------

    detail_keywords = [
        "explain",
        "detail",
        "detailed",
        "deep",
        "complete",
        "full",
        "elaborate",
        "step by step"
    ]

    wants_detail = any(keyword in lower_question for keyword in detail_keywords)

    if wants_detail:
        instruction = """
Give a detailed explanation.
Use headings and bullet points where helpful.
"""
    else:
        instruction = """
Keep your answer under 80 words.
Be concise and direct.
"""

    # -----------------------------
    # Generate AI Response
    # -----------------------------

    try:

        response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=original_question,
    config={
        "system_instruction": SYSTEM_PROMPT,
        "max_output_tokens": 120,
        "temperature": 0.4,
    }
)

        if response.text:
            return response.text.strip()

        return "Sorry, I couldn't generate a response."

    except Exception as e:
        return f"❌ Error: {str(e)}"