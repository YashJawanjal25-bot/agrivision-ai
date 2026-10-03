import argparse
import os
import sys
import torch
import torch.nn.functional as F
from PIL import Image

from ml.dataset import get_eval_transforms
from ml.model import load_trained_model
from ml.utils import get_device, load_json


def parse_class_label(raw_class_name):
    """
    Parses PlantVillage class names such as:
    'Tomato___Early_blight' -> ('Tomato', 'Early Blight')
    'Corn_(maize)___Common_rust_' -> ('Corn (Maize)', 'Common Rust')
    """
    if "___" in raw_class_name:
        plant_raw, disease_raw = raw_class_name.split("___", 1)
    else:
        plant_raw = raw_class_name
        disease_raw = "Unknown"

    plant = plant_raw.replace("_", " ").replace("(", " (").replace("  ", " ").strip()
    disease = disease_raw.replace("_", " ").strip()
    return plant, disease


def predict_image(
    image_input,
    model_path="models/plant_disease_model.pth",
    class_names_path="models/class_names.json",
    top_k=3,
    device=None,
):
    """
    Performs inference on a single plant image using the trained ResNet-18 model.

    Args:
        image_input: File path (str) or PIL.Image.Image instance.
        model_path: Path to the trained .pth checkpoint.
        class_names_path: Path to class_names.json.
        top_k: Number of highest-probability candidate classes to return.
        device: Torch device (defaults to auto-detected CUDA or CPU).

    Returns:
        dict containing 'plant', 'disease', 'class_name', 'confidence', 'top_predictions'.
    """
    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model checkpoint not found at '{model_path}'. "
            "Please train the model before running predictions."
        )

    if not os.path.exists(class_names_path):
        raise FileNotFoundError(
            f"Class names mapping not found at '{class_names_path}'."
        )

    class_names = load_json(class_names_path)

    if device is None:
        device = get_device()

    # Load model
    model = load_trained_model(model_path, num_classes=len(class_names), device=device)

    # Open image if path was given
    if isinstance(image_input, str):
        if not os.path.exists(image_input):
            raise FileNotFoundError(f"Image not found at '{image_input}'.")
        image = Image.open(image_input).convert("RGB")
    elif isinstance(image_input, Image.Image):
        image = image_input.convert("RGB")
    else:
        raise ValueError("image_input must be a file path string or PIL Image object.")

    # Preprocess with standard eval transform
    transform = get_eval_transforms()
    input_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        logits = model(input_tensor)
        probabilities = F.softmax(logits, dim=1).squeeze(0)

    # Extract top-k probabilities
    k = min(top_k, len(class_names))
    top_probs, top_indices = torch.topk(probabilities, k=k)

    top_predictions = []
    for prob, idx in zip(top_probs, top_indices):
        c_name = class_names[idx.item()]
        c_plant, c_disease = parse_class_label(c_name)
        top_predictions.append({
            "class_name": c_name,
            "plant": c_plant,
            "disease": c_disease,
            "confidence": round(float(prob.item()), 4),
            "percentage": f"{float(prob.item()) * 100:.2f}%",
        })

    primary = top_predictions[0]
    plant, disease = parse_class_label(primary["class_name"])

    return {
        "plant": plant,
        "disease": primary["class_name"],
        "disease_display": disease,
        "confidence": f"{primary['confidence'] * 100:.1f}%",
        "confidence_score": primary["confidence"],
        "top_predictions": top_predictions,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Predict plant disease from a single leaf image")
    parser.add_argument("--image", type=str, required=True, help="Path to input plant leaf image")
    parser.add_argument("--model-path", type=str, default="models/plant_disease_model.pth")
    parser.add_argument("--class-names", type=str, default="models/class_names.json")
    args = parser.parse_args()

    try:
        res = predict_image(
            image_input=args.image,
            model_path=args.model_path,
            class_names_path=args.class_names,
        )

        print("\n================ Prediction Result ================")
        print(f"Plant:       {res['plant']}")
        print(f"Disease:     {res['disease']}")
        print(f"Confidence:  {res['confidence']}")
        print("\nTop 3 Predictions:")
        for idx, pred in enumerate(res["top_predictions"], 1):
            print(f"  {idx}. {pred['class_name']:<40} -> {pred['percentage']}")
        print("===================================================\n")
    except Exception as e:
        print(f"\n[Prediction Error] {e}\n")
        sys.exit(1)
