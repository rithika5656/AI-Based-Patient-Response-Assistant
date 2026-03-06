# AI Visual Health Analysis

## Module Description

AI Visual Health Analysis is a healthcare AI feature that leverages computer vision and deep learning to analyze a patient's facial image captured via a device camera. The system detects visible health indicators — such as eye redness, dark circles, pale skin, facial swelling, and signs of fatigue — and generates preliminary health insights. This enables quick, non-invasive health screening directly from a web or mobile application, helping patients identify potential health concerns early and prompting timely medical consultations.

---

## Workflow

### Step 1 — Camera Access
The patient opens the health application and grants camera permission. The frontend initializes the webcam feed using the browser's MediaDevices API.

### Step 2 — Face Image Capture
The system captures a still frame of the patient's face from the live camera feed. The image is encoded and sent to the backend for processing.

### Step 3 — Face Detection
A face detection model (OpenCV Haar Cascade or DNN-based detector) identifies and isolates the facial region from the captured image, cropping it for focused analysis.

### Step 4 — Health Indicator Analysis
Computer vision and AI models analyze the detected face for visible health indicators:

| Indicator | Detection Method |
|---|---|
| **Eye Redness** | Color histogram analysis of the sclera region |
| **Dark Circles** | Intensity and contrast analysis around the periorbital area |
| **Pale Skin** | Skin tone deviation from baseline using color space conversion (HSV/LAB) |
| **Facial Swelling** | Facial landmark distance comparison against standard proportions |
| **Signs of Fatigue** | Eye aspect ratio (EAR), drooping eyelids, reduced blink rate |

### Step 5 — Feature Extraction
The AI processes extracted facial features through a trained classification model to produce confidence scores for each health indicator.

### Step 6 — Health Insight Generation
The system compiles detected indicators and generates a preliminary health insight. Optionally, the Google Gemini API produces a human-readable explanation summarizing the findings in simple language.

### Step 7 — Visual Report
Results are displayed to the patient in a clean visual report showing:
- Detected indicators with confidence levels
- A summary health insight
- Visual highlights on the facial image (annotated regions)

### Step 8 — Doctor Consultation Suggestion
If abnormal indicators exceed a defined threshold, the system recommends that the patient consult a healthcare professional for further evaluation.

---

## Technical Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js + react-webcam | Webcam integration, image capture, visual report UI |
| **Backend** | FastAPI (Python) | API endpoints, image processing orchestration |
| **Computer Vision** | OpenCV | Face detection, image preprocessing, region extraction |
| **AI Models** | TensorFlow / PyTorch | Health indicator classification and scoring |
| **AI Explanation** | Google Gemini API (optional) | Human-readable health insight generation |
| **Database** | MongoDB / PostgreSQL | Storing analysis results, patient history |

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React.js)               │
│  ┌───────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Webcam   │→ │ Image Capture│→ │ Visual Report│ │
│  └───────────┘  └──────┬───────┘  └──────────────┘ │
└─────────────────────────┼───────────────────────────┘
                          │ Image (Base64/Blob)
                          ▼
┌─────────────────────────────────────────────────────┐
│                  BACKEND (FastAPI)                   │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────┐ │
│  │ Face Detect  │→ │ AI Analysis   │→ │ Gemini   │ │
│  │ (OpenCV)     │  │ (TF/PyTorch)  │  │ (Optional│ │
│  └──────────────┘  └───────────────┘  └──────────┘ │
│                          │                          │
│                          ▼                          │
│                 ┌─────────────────┐                 │
│                 │    Database     │                 │
│                 │ (MongoDB/PgSQL) │                 │
│                 └─────────────────┘                 │
└─────────────────────────────────────────────────────┘
```

---

## Role in Early Detection & Quick Health Screening

### Early Detection
- **Non-invasive screening**: Patients can perform a basic health check from home using just a camera — no medical equipment needed.
- **Pattern recognition**: AI models can detect subtle changes in facial appearance (e.g., gradual skin pallor, increasing dark circles) that a patient may overlook.
- **Longitudinal tracking**: By storing past analysis results, the system can track changes over time and flag worsening trends before symptoms become severe.

### Quick Health Screening
- **Instant results**: Analysis completes within seconds, providing immediate preliminary feedback.
- **Accessibility**: Works on any device with a camera — smartphones, laptops, tablets — making healthcare screening accessible to remote and underserved areas.
- **Triage support**: Helps prioritize patients who show abnormal indicators, directing them toward timely medical consultations.
- **Reduced clinic load**: Routine visual screening can be performed at home, reducing unnecessary clinic visits while ensuring those who need attention receive it promptly.

### Healthcare Impact
This module bridges the gap between self-observation and professional diagnosis. It does not replace a doctor's evaluation but serves as an intelligent first-pass screening tool that empowers patients with awareness and encourages proactive healthcare decisions.

---

> **Disclaimer**: AI Visual Health Analysis provides preliminary insights only. It is not a diagnostic tool. All findings should be reviewed and confirmed by a qualified healthcare professional.
