from fastapi import APIRouter, UploadFile, File, HTTPException, status
from backend.app.utils.image_processing import validate_and_process_image
from backend.app.ml.model_loader import get_loaded_model, is_model_available
from backend.app.ml.predictor import run_inference
from backend.app.services.disease_info import get_disease_details

router = APIRouter()


@router.get("/health")
def health_check():
    """Health check endpoint indicating API operational status and model readiness."""
    model_ready = is_model_available()
    return {
        "status": "ok",
        "service": "AgriVision AI Prediction Engine",
        "model_available": model_ready,
    }


@router.post("/predict")
async def predict_crop_disease(file: UploadFile = File(...)):
    """
    Accepts an uploaded leaf photograph (JPG/PNG <= 10MB), runs neural inference
    via PyTorch / HuggingFace model, queries the agronomic disease database, and returns
    structured diagnostic recommendations.

    Flow:
        Uploaded image -> Validate image -> Preprocess image -> Load model ->
        Predict -> Retrieve disease info -> Return complete result
    """
    # 1. Validate image format, integrity, and size (<= 10MB)
    _, tensor, _ = await validate_and_process_image(file)

    # 2. Check if PyTorch model checkpoint is available (loads custom or pre-trained HF model)
    model, class_names, error, is_huggingface = get_loaded_model()
    if model is None or class_names is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Plant disease model is not available: {error}"
        )

    # 3. Neural inference
    try:
        predicted_class, confidence, top_predictions = run_inference(
            model=model,
            class_names=class_names,
            tensor=tensor,
            is_huggingface=is_huggingface,
            top_k=3,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while executing model inference on the uploaded image: {str(e)}"
        )

    # 4. Fetch disease details from knowledge base
    details = get_disease_details(predicted_class)

    # 5. Assemble structured response contract
    return {
        "plant": details["plant"],
        "disease": details["disease"],
        "class_name": predicted_class,
        "confidence": confidence,
        "symptoms": details["symptoms"],
        "causes": details["causes"],
        "treatment": details["treatment"],
        "prevention": details["prevention"],
        "agricultural_advice": details["agricultural_advice"],
        "top_predictions": top_predictions,
    }
