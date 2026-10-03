# AgriVision AI 🌱

> **See the Disease. Understand the Cause. Protect the Crop.**

AgriVision AI is a full-stack, production-structured AI/ML application for plant disease detection, grounded agricultural advisory, and precision crop health management. Built with React, FastAPI, PyTorch, and Retrieval-Augmented Generation (RAG).

---

## Features

| Feature | Status |
|---|---|
| **Landing Page** — AI-themed, responsive design | ✅ |
| **Firebase Authentication** — Email/password + Demo Mode fallback | ✅ |
| **Plant Disease Detection** — Real PyTorch / MobileNetV2 neural inference | ✅ |
| **38-Class PlantVillage Classification** — Covers 14 crop species | ✅ |
| **Low-Confidence Warning** — Amber alert when confidence < 60% | ✅ |
| **Disease Knowledge Base** — Symptoms, causes, treatment, prevention, advice | ✅ |
| **RAG Agricultural Assistant** — Grounded answers with extension citations | ✅ |
| **"Ask AI About This Disease"** — One-click deep-link from prediction | ✅ |
| **Prediction History** — Firestore cloud sync + localStorage Demo fallback | ✅ |
| **User Profile** — Account info, scan count, password reset, logout | ✅ |
| **Dashboard** — Quick actions, live statistics, feature grid | ✅ |
| **Protected Routes** — Firestore security rules enforcing user isolation | ✅ |
| **Docker Deployment** — Dockerfile + docker-compose.yml | ✅ |

---

## Technology Stack

### Frontend
- **React 18** with React Router v6
- **Tailwind CSS** — Agricultural/AI dark-mode design system
- **Lucide React** — Icon library
- **Firebase SDK** — Auth + Firestore (with localStorage Demo fallback)
- **Vite** — Development server and production build

### Backend
- **FastAPI** — REST API framework
- **PyTorch / MobileNetV2** — Pre-trained PlantVillage plant disease classifier (38 classes, HuggingFace model)
- **HuggingFace Transformers** — Model hosting integration
- **Scikit-Learn TF-IDF** — RAG vector similarity search
- **Pillow** — Image validation and preprocessing
- **python-multipart** — File upload handling

### Database & Storage
- **Firebase Firestore** — Cloud prediction history (account-isolated per user)
- **localStorage** — Demo Mode account-isolated history fallback (no Firebase config required)

### Machine Learning Pipeline
- **Dataset**: [PlantVillage](https://github.com/spMohanty/PlantVillage-Dataset) (38 classes, 14 plant species, ~54,000 images)
- **Pre-trained Model**: `linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification` (HuggingFace)
- **Custom Training**: ResNet-18 backbone via `ml/train.py`

---

## Architecture

```
AgriVision AI
      │
      ├── React Frontend (localhost:5173)
      │     ├── src/pages/         ← DashboardPage, DetectPage, AssistantPage, HistoryPage, ProfilePage
      │     ├── src/services/      ← api.js, history.js
      │     └── src/context/       ← AuthContext.jsx
      │
      └── FastAPI Backend (localhost:8000)
            ├── POST /predict      ← PyTorch plant disease inference
            ├── GET  /health       ← Backend health check
            └── POST /assistant    ← RAG Agricultural Assistant
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
   PyTorch Model          RAG Pipeline
   (MobileNetV2)          (TF-IDF Vector Search)
         │                   │
         ▼                   ▼
  38-Class                Agricultural
  Diagnosis               Knowledge Base
         │                   │
         ▼                   ▼
  Symptoms,            Grounded Answer
  Treatment,           + Extension
  Prevention           Source Citations
```

---

## Project Structure

```
c:\antigravity\
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI entrypoint, CORS, lifespan
│   │   ├── routes/
│   │   │   ├── prediction.py           # GET /health, POST /predict
│   │   │   └── assistant.py            # POST /assistant (RAG)
│   │   ├── ml/
│   │   │   ├── model_loader.py         # HuggingFace + custom model loader
│   │   │   └── predictor.py            # Softmax inference, top-k results
│   │   ├── services/
│   │   │   └── disease_info.py         # Loads disease_information.json
│   │   └── utils/
│   │       └── image_processing.py     # Image validation + tensor transform
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/                      # DashboardPage, DetectPage, AssistantPage, HistoryPage, ProfilePage
│   │   ├── components/
│   │   │   ├── dashboard/              # DashboardLayout, Sidebar, DashboardNavbar
│   │   │   └── detect/                 # ImageUploader, ImagePreview, AnalysisResult, LoadingState
│   │   ├── services/
│   │   │   ├── api.js                  # POST /predict, POST /assistant
│   │   │   └── history.js             # Firestore + localStorage history service
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Firebase Auth + Demo Mode
│   │   ├── firebase/
│   │   │   └── config.js              # Firebase app initialization
│   │   └── routes/
│   │       ├── AppRoutes.jsx           # All page routes
│   │       └── ProtectedRoute.jsx      # Auth guard
│   ├── .env.example
│   └── package.json
│
├── rag/
│   ├── documents/
│   │   └── agricultural_knowledge.json # 10 authoritative extension documents
│   ├── config.py                       # RAG paths & confidence threshold
│   ├── embeddings.py                   # TF-IDF vector index + cosine similarity search
│   ├── retriever.py                    # RAG answer synthesis + source citations
│   └── ingest.py                       # Corpus ingestion script
│
├── ml/
│   ├── model.py                        # ResNet-18 architecture
│   ├── dataset.py                      # PlantVillage dataset loader + augmentations
│   ├── train.py                        # Training loop, checkpointing
│   ├── evaluate.py                     # Test evaluation, confusion matrix
│   ├── predict.py                      # CLI + callable single-image prediction
│   └── utils.py                        # Device detection, logging
│
├── data/
│   ├── PlantVillage/                   # Dataset folder (gitignored, populate manually)
│   └── disease_information.json        # 38-class agronomic knowledge base
│
├── models/                             # Trained model checkpoints (gitignored)
│   ├── plant_disease_model.pth         # (generated after training)
│   └── class_names.json                # (generated after training)
│
├── firestore.rules                     # Firestore security rules
├── Dockerfile                          # FastAPI Docker container
├── docker-compose.yml                  # Backend orchestration
├── .gitignore
└── README.md
```

---

## Dataset

AgriVision AI uses the **PlantVillage dataset** for training the custom ResNet-18 model.

| Property | Value |
|---|---|
| **Images** | ~54,000 |
| **Classes** | 38 (14 plant species × disease categories) |
| **Format** | JPG images organized into class folders |
| **Split** | 70% Train / 15% Validation / 15% Test |

**Supported Crops**: Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper (Bell), Potato, Raspberry, Soybean, Squash, Strawberry, Tomato

> ⚠️ **Note**: Cereal crops such as Rice, Wheat, or Sugarcane are **not in the PlantVillage dataset**. These will be mapped to the visually closest included class (typically Corn/Maize).

### Download Options

**Option 1 — Automated HuggingFace Download (Recommended):**
```powershell
cd c:\antigravity
python ml/setup_and_train.py
```

**Option 2 — Kaggle Manual Download:**
1. Download from: https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset
2. Extract to `data/PlantVillage/` preserving the `ClassName/image.jpg` folder structure

---

## Machine Learning Model

### Pre-Trained Model (Used by Default)
The backend automatically loads `linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification` from HuggingFace when no custom trained model is found at `models/plant_disease_model.pth`.

### Custom Training Instructions
```powershell
# 1. Ensure PlantVillage dataset is downloaded to data/PlantVillage/
# 2. Run training (10 epochs, ResNet-18, CPU-compatible):
cd c:\antigravity
python ml/train.py --epochs 10 --batch-size 32

# 3. Model saved to:
#    models/plant_disease_model.pth
#    models/class_names.json
```

**Training Time Estimates:**
| Hardware | Approx. Time (10 epochs) |
|---|---|
| CPU only | 90–180 minutes |
| NVIDIA GPU | 15–30 minutes |

### Model Evaluation
```powershell
python ml/evaluate.py
```
Outputs accuracy, precision, recall, F1-score, and confusion matrix.

---

## FastAPI Backend

### Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `GET /health` | GET | Backend health and model availability |
| `POST /predict` | POST | Upload leaf image → disease prediction |
| `POST /assistant` | POST | RAG agricultural advisory question |

### Running the Backend
```powershell
cd c:\antigravity
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

### API Documentation
Interactive Swagger docs available at: http://127.0.0.1:8000/docs

---

## Frontend Setup

### Prerequisites
- Node.js v18+ (tested with v24.19.0)
- npm 11+

> ⚠️ **PowerShell Note:** On Windows with restricted execution policy, use `npm.cmd` instead of `npm`.

### Install & Run
```powershell
cd c:\antigravity\frontend
npm.cmd install
npm.cmd run dev
```
Frontend starts at: **http://localhost:5173**

---

## Firebase Setup

Firebase is **optional**. The app runs in full Demo Mode without any Firebase configuration.

### To Enable Real Firebase Cloud Auth + Firestore History:

1. Go to [Firebase Console](https://console.firebase.google.com) → **Create Project**
2. Add a **Web App** to your project
3. Enable **Authentication** → Email/Password provider
4. Enable **Firestore** → Create database in production mode
5. Copy `frontend/.env.example` to `frontend/.env` and fill in your credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

6. Deploy Firestore security rules:
```bash
firebase deploy --only firestore:rules
```

---

## RAG Setup

The RAG (Retrieval-Augmented Generation) system uses TF-IDF vector similarity to search authoritative agricultural extension documents.

### Knowledge Base Location
```
rag/documents/agricultural_knowledge.json
```

### Adding New Documents
Add entries to `agricultural_knowledge.json` following this structure:
```json
{
  "id": "doc_011",
  "title": "Document Title",
  "source": "Source Organization",
  "url": "https://source-url.org",
  "crop": "Tomato",
  "topic": "Early Blight Management",
  "content": "Full authoritative text content..."
}
```

### Test the RAG Ingestion
```powershell
cd c:\antigravity
python rag/ingest.py
```

---

## Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Backend (optional `backend/.env`)
```env
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
MODEL_PATH=models/plant_disease_model.pth
CLASSES_PATH=models/class_names.json
```

---

## How to Run Locally

### Step 1 — Start FastAPI Backend
```powershell
cd c:\antigravity
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Step 2 — Start React Frontend
```powershell
cd c:\antigravity\frontend
npm.cmd run dev
```

### Step 3 — Open in Browser
- **App**: http://localhost:5173
- **API Docs**: http://127.0.0.1:8000/docs
- **Demo Login**: Any email/password (Demo Mode active when Firebase is unconfigured)

---

## How to Deploy

### Option 1 — Docker (Backend)
```bash
# Build and start backend container
docker-compose up --build

# Backend will be available at http://localhost:8000
```

### Option 2 — Manual

**Backend:**
```bash
pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
# Serve the dist/ folder with any static host (Vercel, Netlify, Firebase Hosting)
```

### Recommended Hosting Platforms

| Component | Platform |
|---|---|
| React Frontend | Vercel, Netlify, Firebase Hosting |
| FastAPI Backend | Render, Railway, Google Cloud Run |
| Database | Firebase Firestore (already cloud-native) |

---

## Known Limitations

1. **PlantVillage Scope**: The model is trained on 14 crop species. Leaf images from crops outside this set (Rice, Wheat, Sugarcane, Cassava) will be mapped to the closest visual class.
2. **CPU Training**: Training the ResNet-18 from scratch on CPU takes 90–180 minutes (10 epochs). A GPU is strongly recommended for training.
3. **RAG Knowledge Depth**: The current knowledge base contains 10 curated extension documents. Adding more documents to `rag/documents/agricultural_knowledge.json` improves answer coverage.
4. **No LLM Integration**: The RAG assistant uses TF-IDF similarity + structured document retrieval rather than a large language model. Answers are grounded passages from the knowledge base.
5. **No Image Storage**: Leaf images are processed in memory and not permanently stored. Only diagnostic metadata is saved to Firestore/localStorage.
6. **Demo Mode History**: In Demo Mode, history is stored per-user in localStorage (not cloud-synced). Clearing browser data clears history.

---

## Future Improvements

- [ ] Integrate a hosted LLM (Gemini, GPT-4) for natural language RAG answer generation
- [ ] Expand PlantVillage support with Rice-specific models (IRRI dataset)
- [ ] Add Firebase Storage for optional leaf image archiving
- [ ] Add Firestore-backed crop recommendation history
- [ ] Implement model retraining pipeline with continuous improvement
- [ ] Add geolocation-based seasonal disease risk alerts
- [ ] Implement field mapping and batch leaf analysis
- [ ] Add mobile PWA support for offline-first use
- [ ] Expand RAG knowledge base with 50+ FAO and CGIAR documents
- [ ] Add multi-language support for farmer accessibility

---

## Contributing

This project follows a clean modular architecture. To add a new crop to the knowledge base:
1. Add entries to `data/disease_information.json`
2. Add extension documents to `rag/documents/agricultural_knowledge.json`
3. If training a custom model, add the new class images to `data/PlantVillage/`

---

## License & Disclaimer

This application is provided for **educational and research purposes**. Disease identification results should be **verified by a qualified agricultural extension specialist** before making crop management decisions. Chemical treatment recommendations follow general guidelines only — always consult official product labels and local agricultural authority regulations.

---

*AgriVision AI — Precision Agricultural AI System*
