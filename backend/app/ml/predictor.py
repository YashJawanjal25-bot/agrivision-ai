import torch
import torch.nn.functional as F
from ml.utils import get_device


def run_inference(model, class_names, tensor, is_huggingface=False, top_k=3):
    """
    Executes neural network forward pass on input image tensor.

    Args:
        model: Loaded PyTorch ResNet-18 or HuggingFace model.
        class_names: List of string class names.
        tensor: Preprocessed image tensor (1, 3, 224, 224).
        is_huggingface: Boolean indicating if model returns HuggingFace ImageClassifierOutput.
        top_k: Number of highest-confidence predictions to return.

    Returns:
        tuple (predicted_class_name, confidence_float, top_predictions_list)
    """
    device = get_device()
    model.eval()
    tensor = tensor.to(device)

    with torch.no_grad():
        if is_huggingface:
            outputs = model(tensor)
            logits = outputs.logits
        else:
            logits = model(tensor)

        probabilities = F.softmax(logits, dim=1).squeeze(0)

    k = min(top_k, len(class_names))
    top_probs, top_indices = torch.topk(probabilities, k=k)

    top_predictions = []
    for prob, idx in zip(top_probs, top_indices):
        c_name = class_names[idx.item()]
        c_conf = round(float(prob.item()), 4)
        top_predictions.append({
            "class_name": c_name,
            "confidence": c_conf,
        })

    primary_class = top_predictions[0]["class_name"]
    primary_conf = top_predictions[0]["confidence"]

    return primary_class, primary_conf, top_predictions
