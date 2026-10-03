import json
import os
import torch

from ml.model import load_trained_model
from ml.utils import get_device

DEFAULT_MODEL_PATH = os.path.join("models", "plant_disease_model.pth")
DEFAULT_CLASSES_PATH = os.path.join("models", "class_names.json")
PRETRAINED_HF_MODEL = "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"

_loaded_model = None
_loaded_classes = None
_load_error = None
_is_huggingface = False

# Mapping from HuggingFace id2label to PlantVillage standard class names
HF_LABEL_MAP = {
    0: "Apple___Apple_scab",
    1: "Apple___Black_rot",
    2: "Apple___Cedar_apple_rust",
    3: "Apple___healthy",
    4: "Blueberry___healthy",
    5: "Cherry_(including_sour)___Powdery_mildew",
    6: "Cherry_(including_sour)___healthy",
    7: "Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot",
    8: "Corn_(maize)___Common_rust_",
    9: "Corn_(maize)___Northern_Leaf_Blight",
    10: "Corn_(maize)___healthy",
    11: "Grape___Black_rot",
    12: "Grape___Esca_(Black_Measles)",
    13: "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    14: "Grape___healthy",
    15: "Orange___Haunglongbing_(Citrus_greening)",
    16: "Peach___Bacterial_spot",
    17: "Peach___healthy",
    18: "Pepper,_bell___Bacterial_spot",
    19: "Pepper,_bell___healthy",
    20: "Potato___Early_blight",
    21: "Potato___Late_blight",
    22: "Potato___healthy",
    23: "Raspberry___healthy",
    24: "Soybean___healthy",
    25: "Squash___Powdery_mildew",
    26: "Strawberry___Leaf_scorch",
    27: "Strawberry___healthy",
    28: "Tomato___Bacterial_spot",
    29: "Tomato___Early_blight",
    30: "Tomato___Late_blight",
    31: "Tomato___Leaf_Mold",
    32: "Tomato___Septoria_leaf_spot",
    33: "Tomato___Spider_mites_Two-spotted_spider_mite",
    34: "Tomato___Target_Spot",
    35: "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    36: "Tomato___Tomato_mosaic_virus",
    37: "Tomato___healthy",
}


def is_model_available(
    model_path=DEFAULT_MODEL_PATH,
    classes_path=DEFAULT_CLASSES_PATH
):
    """Always returns True because if custom model is missing, we fallback to pre-trained HF model."""
    return True


def load_model_if_available(
    model_path=DEFAULT_MODEL_PATH,
    classes_path=DEFAULT_CLASSES_PATH
):
    """
    Attempts to load custom model from models/plant_disease_model.pth.
    If not available, loads pre-trained PlantVillage model from HuggingFace.
    """
    global _loaded_model, _loaded_classes, _load_error, _is_huggingface

    if _loaded_model is not None and _loaded_classes is not None:
        return _loaded_model, _loaded_classes, None, _is_huggingface

    # 1. Try local custom model first
    if os.path.exists(model_path) and os.path.exists(classes_path):
        try:
            with open(classes_path, "r", encoding="utf-8") as f:
                classes = json.load(f)

            device = get_device()
            model = load_trained_model(model_path, num_classes=len(classes), device=device)

            _loaded_model = model
            _loaded_classes = classes
            _load_error = None
            _is_huggingface = False
            print(f"[AgriVision AI] Loaded custom PyTorch model with {len(classes)} classes on {device}.")
            return _loaded_model, _loaded_classes, None, _is_huggingface
        except Exception as e:
            print(f"[AgriVision AI] Warning loading custom model: {e}. Falling back to pre-trained model.")

    # 2. Fallback to pre-trained HuggingFace PlantVillage model
    try:
        from transformers import AutoModelForImageClassification

        print(f"[AgriVision AI] Loading pre-trained PlantVillage model ({PRETRAINED_HF_MODEL})...")
        model = AutoModelForImageClassification.from_pretrained(PRETRAINED_HF_MODEL)
        device = get_device()
        model.to(device)
        model.eval()

        classes = [HF_LABEL_MAP.get(i, model.config.id2label.get(i, f"Class_{i}")) for i in range(len(HF_LABEL_MAP))]

        _loaded_model = model
        _loaded_classes = classes
        _load_error = None
        _is_huggingface = True
        print(f"[AgriVision AI] Successfully loaded pre-trained HuggingFace model (38 PlantVillage classes) on {device}.")
        return _loaded_model, _loaded_classes, None, _is_huggingface
    except Exception as e:
        _load_error = f"Failed to load plant disease model: {str(e)}"
        print(f"[AgriVision AI] Error loading model: {_load_error}")
        return None, None, _load_error, False


def get_loaded_model():
    """Returns currently loaded (model, classes, error, is_huggingface)."""
    return load_model_if_available()
