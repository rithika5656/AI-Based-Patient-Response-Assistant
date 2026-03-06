"""LLaMA AI integration service via Groq."""

import asyncio

from groq import Groq

from app.config import settings

# Instantiate the Groq client once at module level
_client = Groq(api_key=settings.GROQ_API_KEY)

# LLaMA model to use
_MODEL = "llama-3.3-70b-versatile"

# System prompt that guides LLaMA to produce safe, medically-oriented drafts
_SYSTEM_PROMPT = (
    "You are a helpful medical assistant AI. "
    "A patient has asked the following health-related question. "
    "Provide a clear, empathetic, and medically accurate draft response. "
    "Always remind the patient that this is an AI-generated draft and "
    "a qualified doctor will review it before the final reply is sent. "
    "Do NOT diagnose or prescribe medication — only provide general "
    "health information and suggest consulting a healthcare professional."
)


async def generate_ai_response(patient_question: str) -> str:
    """Send the patient question to LLaMA via Groq and return the draft response."""
    try:
        response = await asyncio.to_thread(
            _client.chat.completions.create,
            model=_MODEL,
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user", "content": patient_question},
            ],
            temperature=0.7,
            max_tokens=1024,
        )
        return response.choices[0].message.content
    except Exception as exc:
        return (
            f"[AI service unavailable] Unable to generate a draft response. "
            f"Error: {exc}. The doctor will compose a response manually."
        )
