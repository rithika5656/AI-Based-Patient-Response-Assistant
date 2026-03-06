import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = "AI-Based Patient Response Assistant"
    VERSION: str = "1.0.0"

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "sqlite:///./patient_assistant.db"
    )

    # Groq (LLaMA)
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-production")


settings = Settings()
