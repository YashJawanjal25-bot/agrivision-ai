# AgriVision AI - Backend Architecture (FastAPI + PyTorch)

This directory is structured to host the upcoming machine learning inference and API services for AgriVision AI.

## Architecture Overview

```
backend/
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── endpoints/
│   │           ├── __init__.py
│   │           ├── disease_detection.py  # Image upload & prediction endpoint
│   │           └── health.py             # Service health check
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py                     # App settings, environment variables
│   │   └── security.py                   # Firebase token verification middleware
│   ├── models/
│   │   ├── __init__.py
│   │   ├── classifier.py                 # PyTorch model definition (e.g., EfficientNet/ResNet)
│   │   └── weights/                      # Model checkpoints (.pt/.pth)
│   └── services/
│       ├── __init__.py
│       ├── image_preprocessor.py         # Image resizing, normalization, augmentations
│       ├── inference_engine.py           # PyTorch inference pipeline & Grad-CAM visualizer
│       └── disease_kb.py                 # Disease causes, treatment & crop protection recommendations
├── requirements.txt                      # Python dependencies (fastapi, torch, etc.)
└── main.py                               # FastAPI application entrypoint
```

## Future Integration Points

1. **Prediction API**:
   - `POST /api/v1/detect`: Accepts crop leaf image, runs PyTorch model inference, returns detected disease, confidence score, pathogen cause, and actionable protection recommendations.
2. **Auth Verification**:
   - Accepts Firebase Auth Bearer token from the React frontend, verifying requests using Firebase Admin SDK.
3. **RAG / Knowledge Base**:
   - Grounded agronomical advice for treatment, humidity control, and soil management.
