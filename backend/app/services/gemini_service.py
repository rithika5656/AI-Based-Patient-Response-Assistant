"""LLaMA AI integration service via Groq."""

import asyncio

from groq import Groq

from app.config import settings

# Instantiate the Groq client once at module level
_client = Groq(api_key=settings.GROQ_API_KEY)

# LLaMA model to use
_MODEL = "llama-3.3-70b-versatile"

# Base system prompt
_BASE_SYSTEM_PROMPT = (
    "You are a helpful medical assistant AI. "
    "A patient has asked the following health-related question. "
    "Respond in Tanglish (Tamil written in English script) mixed with simple English medical terms. "
    "If the patient writes in Tamil or Tanglish, reply in Tanglish. "
    "If the patient writes in English, still reply in Tanglish for a friendly local feel. "
    "Provide a concise, empathetic, and medically accurate draft response. "
    "Keep your answer SHORT — use brief bullet points or a few short sentences instead of long paragraphs. "
    "Always mention briefly that this is an AI-generated draft and a doctor will review it. "
    "Do NOT diagnose or prescribe medication — only provide general "
    "health information and suggest consulting a healthcare professional."
)

# Department-specific prompt additions
_DEPARTMENT_PROMPTS = {
    "General": (
        "You are responding from the General department. "
        "Provide broad, helpful health information and guidance."
    ),
    "Billing": (
        "You are responding from the Billing department. "
        "Focus on billing, insurance, payment plans, and cost-related inquiries. "
        "Be helpful with financial and administrative healthcare questions."
    ),
    "Scheduling": (
        "You are responding from the Scheduling department. "
        "Focus on appointment scheduling, availability, rescheduling, and cancellations. "
        "Help patients understand the scheduling process and next steps."
    ),
    "Medical Query": (
        "You are responding from the Medical Query department. "
        "Focus specifically on medical questions, symptoms, and health concerns. "
        "Provide detailed medical information while reminding patients to consult their doctor."
    ),
}


async def generate_ai_response(patient_question: str, department: str = "General") -> str:
    """Send the patient question to LLaMA via Groq and return the draft response."""
    dept_prompt = _DEPARTMENT_PROMPTS.get(department, _DEPARTMENT_PROMPTS["General"])
    system_prompt = f"{_BASE_SYSTEM_PROMPT}\n\n{dept_prompt}"

    try:
        response = await asyncio.to_thread(
            _client.chat.completions.create,
            model=_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": patient_question},
            ],
            temperature=0.7,
            max_tokens=512,
        )
        return response.choices[0].message.content
    except Exception as exc:
        return (
            f"[AI service unavailable] Unable to generate a draft response. "
            f"Error: {exc}. The doctor will compose a response manually."
        )
