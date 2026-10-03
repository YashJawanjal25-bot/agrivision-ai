import os
import torch
import torch.nn as nn
from torchvision import models


def create_model(num_classes, pretrained=True):
    """
    Initializes a ResNet18 model for plant disease classification.

    Args:
        num_classes (int): Number of target classes detected in the dataset.
        pretrained (bool): Whether to load torchvision ImageNet pretrained weights.

    Returns:
        torch.nn.Module: Configured ResNet-18 model with replaced final linear layer.
    """
    if pretrained:
        try:
            weights = models.ResNet18_Weights.DEFAULT
            model = models.resnet18(weights=weights)
        except Exception as e:
            print(f"[AgriVision AI] Warning: Pretrained weights download failed ({e}). Initializing randomly.")
            model = models.resnet18(weights=None)
    else:
        model = models.resnet18(weights=None)

    # Replace the final fully connected classification layer
    in_features = model.fc.in_features
    model.fc = nn.Linear(in_features, num_classes)

    return model


def load_trained_model(model_path, num_classes, device=None):
    """
    Loads saved checkpoint weights into the ResNet-18 architecture.

    Args:
        model_path (str): Path to the .pth weights file.
        num_classes (int): Number of classes.
        device (torch.device, optional): Device to map weights onto.

    Returns:
        torch.nn.Module: Loaded model in eval mode.
    """
    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Trained model checkpoint not found at '{model_path}'. "
            "Please run 'python ml/train.py' after placing the PlantVillage dataset."
        )

    if device is None:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model = create_model(num_classes=num_classes, pretrained=False)
    state_dict = torch.load(model_path, map_location=device)

    # Support checkpoint containing 'model_state_dict' or direct state_dict
    if isinstance(state_dict, dict) and "model_state_dict" in state_dict:
        model.load_state_dict(state_dict["model_state_dict"])
    else:
        model.load_state_dict(state_dict)

    model.to(device)
    model.eval()
    return model
