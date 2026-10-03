import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from backend.app.routes.prediction import router as prediction_router
from backend.app.routes.assistant import router as assistant_router
from backend.app.ml.model_loader import load_model_if_available


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: attempt to warm up the model if checkpoint exists or load pre-trained HF model
    print("[AgriVision AI] Initializing FastAPI Prediction Backend...")
    model, classes, err, is_hf = load_model_if_available()
    if model is not None:
        source = "HuggingFace Pre-trained Model" if is_hf else "Custom Trained PyTorch Checkpoint"
        print(f"[AgriVision AI] Model successfully loaded ({source}) with {len(classes)} classes.")
    else:
        print(f"[AgriVision AI] Notice: {err}")
    yield
    print("[AgriVision AI] Shutting down backend service.")


app = FastAPI(
    title="AgriVision AI Backend",
    description="Intelligent Plant Disease Detection and Agronomic Recommendation API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration for React Frontend
raw_origins = os.getenv(
    "CORS_ORIGINS",
    "*"
)
origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if "*" not in origins else ["*"],
    allow_credentials=True if "*" not in origins else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routes
app.include_router(prediction_router)
app.include_router(assistant_router)


@app.get("/")
def root():
    return {
        "service": "AgriVision AI Prediction API",
        "version": "1.0.0",
        "documentation": "/docs",
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "assistant": "/assistant"
        }
    }
