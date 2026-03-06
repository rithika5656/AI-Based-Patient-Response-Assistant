# AI-Based Patient Response Assistant

An intelligent healthcare chatbot system where patients ask health-related questions, Google Gemini AI generates draft responses, and doctors review/edit before delivering the final reply.

---

## System Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTEM ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────┘

  ┌──────────────────────┐
  │   Patient (Browser)  │
  │  React Chatbot UI    │
  └─────────┬────────────┘
            │ 1. Patient asks a health question
            ▼
  ┌──────────────────────┐
  │   FastAPI Backend    │
  │   (REST API Server)  │
  ├──────────────────────┤
  │ • Receives query     │
  │ • Stores in DB       │
  │ • Calls Gemini AI    │
  └─────────┬────────────┘
            │ 2. Sends query to AI
            ▼
  ┌──────────────────────┐
  │  Google Gemini API   │
  │  (AI Processing)     │
  ├──────────────────────┤
  │ • Generates draft    │
  │   medical response   │
  └─────────┬────────────┘
            │ 3. Returns AI-generated response
            ▼
  ┌──────────────────────┐
  │   Database           │
  │  (PostgreSQL/MongoDB)│
  ├──────────────────────┤
  │ • Stores query       │
  │ • Stores AI response │
  │ • Stores final reply │
  └─────────┬────────────┘
            │ 4. Doctor views pending queries
            ▼
  ┌──────────────────────┐
  │  Doctor Dashboard    │
  │  (React Admin Panel) │
  ├──────────────────────┤
  │ • Reviews AI draft   │
  │ • Edits response     │
  │ • Approves & sends   │
  └─────────┬────────────┘
            │ 5. Final approved response
            ▼
  ┌──────────────────────┐
  │   Patient (Browser)  │
  │  Sees Final Response │
  └──────────────────────┘
```

---

## Detailed Workflow

| Step | Action                                                                 | Component            |
|------|------------------------------------------------------------------------|----------------------|
| 1    | Patient opens the web app and asks a question via the chatbot UI       | React Frontend       |
| 2    | React frontend sends the patient query to FastAPI via Axios POST       | Axios → FastAPI      |
| 3    | FastAPI receives the query and stores it in the database               | FastAPI + Database   |
| 4    | Backend sends the patient query to the Google Gemini API               | FastAPI → Gemini API |
| 5    | Gemini AI processes the question and generates a draft response        | Google Gemini API    |
| 6    | The AI-generated response is returned to the backend                   | Gemini API → FastAPI |
| 7    | Backend stores the AI response in the database                         | FastAPI + Database   |
| 8    | Doctor dashboard displays patient query + AI-generated response        | React Doctor Panel   |
| 9    | Doctor reviews the response and can edit or modify it                  | Doctor Dashboard     |
| 10   | After approval, the final response is sent back to the patient chatbot | FastAPI → React UI   |

---

## Technical Stack

### Frontend
| Technology     | Purpose                              |
|---------------|--------------------------------------|
| React.js      | UI framework for chatbot & dashboard |
| Tailwind CSS  | Utility-first CSS styling            |
| Axios         | HTTP client for API communication    |
| React Router  | Client-side routing                  |

### Backend
| Technology | Purpose                             |
|-----------|-------------------------------------|
| FastAPI    | High-performance Python REST API    |
| Uvicorn    | ASGI server for FastAPI             |
| Pydantic   | Request/response data validation    |
| SQLAlchemy | ORM for database operations         |

### AI Integration
| Technology       | Purpose                         |
|-----------------|---------------------------------|
| Google Gemini API | AI-powered response generation |
| google-generativeai | Python SDK for Gemini        |

### Database
| Technology  | Purpose                            |
|------------|------------------------------------|
| PostgreSQL  | Primary relational database        |
| *MongoDB*   | Alternative NoSQL option           |

### Deployment
| Component  | Platform                     |
|-----------|------------------------------|
| Frontend   | Vercel or Netlify            |
| Backend    | Render or AWS (EC2/Lambda)   |
| Database   | Supabase or MongoDB Atlas    |

---

## Project Structure

```
AI-Based Patient Response Assistant/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── config.py            # Environment & app configuration
│   │   ├── database.py          # Database connection & session
│   │   ├── models.py            # SQLAlchemy / DB models
│   │   ├── schemas.py           # Pydantic request/response schemas
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── patient.py       # Patient-facing API endpoints
│   │   │   └── doctor.py        # Doctor dashboard API endpoints
│   │   └── services/
│   │       ├── __init__.py
│   │       └── gemini_service.py # Google Gemini AI integration
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.js
│   │   ├── App.jsx              # Root component with routing
│   │   ├── api/
│   │   │   └── axios.js         # Axios instance & API helpers
│   │   ├── pages/
│   │   │   ├── PatientChat.jsx  # Patient chatbot interface
│   │   │   └── DoctorDashboard.jsx # Doctor review panel
│   │   └── components/
│   │       ├── ChatMessage.jsx  # Chat bubble component
│   │       ├── QueryCard.jsx    # Doctor query review card
│   │       └── Navbar.jsx       # Navigation bar
│   ├── tailwind.config.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (or MongoDB)
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp .env.example .env         # Add your API keys
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Docker (Full Stack)
```bash
docker-compose up --build
```

---

## API Endpoints

### Patient APIs
| Method | Endpoint                          | Description                     |
|--------|-----------------------------------|---------------------------------|
| POST   | `/api/patient/query`              | Submit a new patient question   |
| GET    | `/api/patient/query/{patient_id}` | Get all queries for a patient   |

### Doctor APIs
| Method | Endpoint                            | Description                          |
|--------|-------------------------------------|--------------------------------------|
| GET    | `/api/doctor/queries`               | List all pending patient queries     |
| GET    | `/api/doctor/query/{query_id}`      | Get a specific query with AI draft   |
| PUT    | `/api/doctor/query/{query_id}`      | Edit and approve the final response  |

---

## Environment Variables

| Variable            | Description                    |
|--------------------|--------------------------------|
| `GEMINI_API_KEY`    | Google Gemini API key          |
| `DATABASE_URL`      | PostgreSQL connection string   |
| `FRONTEND_URL`      | Frontend origin for CORS       |
| `SECRET_KEY`        | JWT / app secret key           |

---

## License

MIT
