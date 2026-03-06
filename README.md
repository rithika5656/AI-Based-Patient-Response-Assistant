# AI-Based Patient Response Assistant

An intelligent healthcare system where patients ask health-related questions, **LLaMA 3.3 AI** (via Groq) generates draft responses with **multilingual support** (English, Tamil, Tanglish), and doctors review/edit before delivering the final reply. Includes an **AI Face Analysis** prototype for visual health screening.

---

## Features

- **Patient Chat** — Real-time health Q&A with AI-generated draft responses
- **Multilingual AI** — Automatically detects and replies in English, Tamil, or Tanglish
- **Doctor Dashboard** — Review, edit, and approve AI-generated responses
- **Department Routing** — General, Billing, Scheduling, Medical Query departments
- **AI Face Analysis** — Camera-based facial health indicator screening (prototype)
- **Dark Professional UI** — Dark navy & white theme with responsive design
- **Single-Host Deployment** — FastAPI serves both the API and the React build

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTEM ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────┘

  ┌──────────────────────┐
  │   Patient (Browser)  │
  │  React SPA (3 pages) │
  │  • Patient Chat      │
  │  • Face Analysis     │
  └─────────┬────────────┘
            │ 1. Patient asks a health question
            ▼
  ┌──────────────────────┐
  │   FastAPI Backend    │
  │   (Port 8000)        │
  ├──────────────────────┤
  │ • REST API           │
  │ • Serves React build │
  │ • Stores in SQLite   │
  │ • Calls Groq/LLaMA  │
  └─────────┬────────────┘
            │ 2. Sends query to AI
            ▼
  ┌──────────────────────┐
  │  Groq Cloud API      │
  │  LLaMA 3.3 70B       │
  ├──────────────────────┤
  │ • Detects language   │
  │ • Generates draft    │
  │   medical response   │
  └─────────┬────────────┘
            │ 3. Returns AI-generated response
            ▼
  ┌──────────────────────┐
  │   SQLite Database    │
  │  patient_assistant.db│
  ├──────────────────────┤
  │ • patient_queries    │
  │ • department_config  │
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

| Step | Action                                                                 | Component             |
|------|------------------------------------------------------------------------|-----------------------|
| 1    | Patient opens the web app and asks a question via the chatbot UI       | React Frontend        |
| 2    | React frontend sends the patient query to FastAPI via Axios POST       | Axios → FastAPI       |
| 3    | FastAPI receives the query and stores it in SQLite                     | FastAPI + SQLite      |
| 4    | Backend sends the patient query to Groq (LLaMA 3.3)                   | FastAPI → Groq API    |
| 5    | LLaMA AI detects language and generates a draft response               | Groq / LLaMA 3.3 70B |
| 6    | The AI-generated response is returned to the backend                   | Groq API → FastAPI    |
| 7    | Backend stores the AI response in the database                         | FastAPI + SQLite      |
| 8    | Doctor dashboard displays patient query + AI-generated response        | React Doctor Panel    |
| 9    | Doctor reviews the response and can edit or modify it                  | Doctor Dashboard      |
| 10   | After approval, the final response is sent back to the patient chatbot | FastAPI → React UI    |

---

## Technical Stack

### Frontend
| Technology       | Version  | Purpose                              |
|-----------------|----------|--------------------------------------|
| React.js        | 18.3     | UI framework for chatbot & dashboard |
| Tailwind CSS    | 3.4      | Utility-first CSS styling            |
| Axios           | 1.7      | HTTP client for API communication    |
| React Router    | 6.26     | Client-side routing (SPA)            |

### Backend
| Technology   | Version  | Purpose                             |
|-------------|----------|-------------------------------------|
| FastAPI     | 0.115    | High-performance Python REST API    |
| Uvicorn     | 0.34     | ASGI server for FastAPI             |
| Pydantic    | 2.10     | Request/response data validation    |
| SQLAlchemy  | 2.0      | ORM for database operations         |

### AI Integration
| Technology   | Purpose                                        |
|-------------|------------------------------------------------|
| Groq API    | Cloud inference platform for LLaMA             |
| LLaMA 3.3 70B Versatile | AI-powered multilingual response generation |
| groq SDK    | Python client for Groq API                     |

### Database
| Technology | Purpose                         |
|-----------|---------------------------------|
| SQLite    | Lightweight embedded database   |

### Deployment
| Mode           | Description                              |
|---------------|------------------------------------------|
| Single-Host   | FastAPI serves React build on port 8000  |
| Docker        | docker-compose for containerized setup   |

---

## Project Structure

```
AI-Based Patient Response Assistant/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                # FastAPI app, serves React build + API
│   │   ├── config.py              # Environment & app configuration
│   │   ├── database.py            # SQLite connection & session management
│   │   ├── models.py              # SQLAlchemy models (PatientQuery, DepartmentConfig)
│   │   ├── schemas.py             # Pydantic request/response schemas
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── patient.py         # Patient-facing API endpoints
│   │   │   └── doctor.py          # Doctor dashboard API endpoints
│   │   └── services/
│   │       ├── __init__.py
│   │       └── gemini_service.py  # Groq/LLaMA AI integration
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.js               # React entry point
│   │   ├── index.css              # Global styles & Tailwind imports
│   │   ├── App.jsx                # Root component with routing
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance & API helpers
│   │   ├── pages/
│   │   │   ├── PatientChat.jsx    # Patient chatbot interface
│   │   │   ├── DoctorDashboard.jsx # Doctor review panel
│   │   │   └── FaceAnalysis.jsx   # AI face health analysis (prototype)
│   │   └── components/
│   │       ├── ChatMessage.jsx    # Chat bubble component
│   │       ├── QueryCard.jsx      # Doctor query review card
│   │       └── Navbar.jsx         # Navigation bar (3 tabs)
│   ├── tailwind.config.js         # Dark navy & white theme config
│   ├── postcss.config.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── AI_Visual_Health_Analysis.md   # Face analysis module documentation
├── LICENSE
└── README.md
```

---

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API Key ([Get one here](https://console.groq.com/keys))

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:
```env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=sqlite:///./patient_assistant.db
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run build
```

### 3. Run (Single-Host)
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Open **http://localhost:8000** — the app serves both the API and the React UI.

### Docker (Full Stack)
```bash
docker-compose up --build
```

---

## Pages

| Page               | Route            | Description                                                    |
|-------------------|------------------|----------------------------------------------------------------|
| Patient Chat      | `/`              | Chat interface — patients ask health questions, AI responds    |
| Doctor Dashboard  | `/doctor`        | Review pending queries, edit AI drafts, approve responses      |
| Face Analysis     | `/face-analysis` | Camera-based facial health indicator screening (prototype)     |

---

## API Endpoints

### Patient APIs
| Method | Endpoint                          | Description                                    |
|--------|-----------------------------------|------------------------------------------------|
| POST   | `/api/patient/query`              | Submit a new patient question → AI draft reply |
| GET    | `/api/patient/query/{patient_id}` | Get all queries for a patient                  |

### Doctor APIs
| Method | Endpoint                            | Description                                 |
|--------|-------------------------------------|---------------------------------------------|
| GET    | `/api/doctor/queries`               | List all queries (optional `?status=` filter)|
| GET    | `/api/doctor/query/{query_id}`      | Get a specific query with AI draft          |
| PUT    | `/api/doctor/query/{query_id}`      | Edit and approve the final response         |
| GET    | `/api/doctor/config/department`     | Get current department configuration        |
| PUT    | `/api/doctor/config/department`     | Update department setting                   |

---

## Database Schema

### `patient_queries`
| Column           | Type     | Description                           |
|-----------------|----------|---------------------------------------|
| id              | UUID     | Primary key                           |
| patient_id      | String   | Patient identifier                    |
| patient_name    | String   | Patient name (default: "Anonymous")   |
| question        | Text     | Patient's health question             |
| ai_response     | Text     | AI-generated draft response           |
| doctor_response | Text     | Doctor-approved final response        |
| department      | String   | Department (General/Billing/Scheduling/Medical Query) |
| status          | Enum     | pending → reviewed → delivered        |
| created_at      | DateTime | Query submission timestamp            |
| reviewed_at     | DateTime | Doctor review timestamp               |

### `department_config`
| Column     | Type   | Description              |
|-----------|--------|--------------------------|
| id        | String | Singleton key            |
| department| String | Active department setting|

---

## Multilingual AI Support

The AI automatically detects the patient's language and responds in the same language:

| Patient Input Language | AI Response Language | Example Input              |
|-----------------------|---------------------|----------------------------|
| English               | English             | "I have a headache"        |
| Tanglish              | Tanglish            | "enakku thalai vali"       |
| Tamil                 | Tamil               | "எனக்கு தலைவலி"             |

---

## Environment Variables

| Variable        | Default                              | Description              |
|----------------|--------------------------------------|--------------------------|
| `GROQ_API_KEY`  | —                                    | Groq API key (required)  |
| `DATABASE_URL`  | `sqlite:///./patient_assistant.db`   | Database connection URL  |
| `FRONTEND_URL`  | `http://localhost:3000`              | CORS allowed origin      |
| `SECRET_KEY`    | `change-me-in-production`            | Application secret key   |

---

## UI Theme

Dark navy (`#0a1929`) & white professional theme with:
- Dark navy background and sidebar panels
- White content cards with subtle shadows
- Blue accent (`#2186eb`) for active states and buttons
- Green/yellow/red status badges
- Responsive design for all screen sizes

---

## License

MIT
