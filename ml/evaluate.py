import argparse
import os
import sys
import torch
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
)

from ml.dataset import load_plant_dataset
from ml.model import load_trained_model
from ml.utils import get_device, load_json, plot_confusion_matrix, plot_training_curves


def evaluate_model(
    model_path="models/plant_disease_model.pth",
    class_names_path="models/class_names.json",
    data_dir="data/PlantVillage",
    results_dir="ml/results",
    batch_size=32,
):
    """
    Evaluates the trained model against the held-out test split.
    Calculates Test Accuracy, Precision, Recall, and F1-score, and renders
    confusion matrix heatmap.
    """
    device = get_device()

    print("\n=======================================================")
    print("      AgriVision AI - Model Evaluation Pipeline        ")
    print("=======================================================")

    # 1. Check prerequisites
    if not os.path.exists(model_path):
        print(f"[ERROR] Model file not found at '{model_path}'.")
        print("Please train the model first with: python ml/train.py")
        sys.exit(1)

    if not os.path.exists(class_names_path):
        print(f"[ERROR] Class names file not found at '{class_names_path}'.")
        sys.exit(1)

    class_names = load_json(class_names_path)
    print(f"Loaded {len(class_names)} classes from {class_names_path}")

    # 2. Load dataset test split
    try:
        _, _, test_loader, _, split_counts = load_plant_dataset(
            data_dir=data_dir,
            batch_size=batch_size,
        )
    except Exception as err:
        print(f"[ERROR] Failed to load dataset: {err}")
        sys.exit(1)

    print(f"Testing on {split_counts['test_count']} held-out images using device: {device}")

    # 3. Load model checkpoint
    model = load_trained_model(model_path, num_classes=len(class_names), device=device)

    all_preds = []
    all_targets = []

    print("\nRunning inference over test set...")
    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            outputs = model(images)
            _, predicted = torch.max(outputs, 1)

            all_preds.extend(predicted.cpu().numpy())
            all_targets.extend(labels.numpy())

    all_preds = np.array(all_preds)
    all_targets = np.array(all_targets)

    # 4. Calculate metrics
    test_acc = accuracy_score(all_targets, all_preds)
    precision_w = precision_score(all_targets, all_preds, average="weighted", zero_division=0)
    recall_w = recall_score(all_targets, all_preds, average="weighted", zero_division=0)
    f1_w = f1_score(all_targets, all_preds, average="weighted", zero_division=0)

    precision_m = precision_score(all_targets, all_preds, average="macro", zero_division=0)
    recall_m = recall_score(all_targets, all_preds, average="macro", zero_division=0)
    f1_m = f1_score(all_targets, all_preds, average="macro", zero_division=0)

    print("\n---------------- Evaluation Metrics -------------------")
    print(f"Test Accuracy:         {test_acc * 100:.2f}%")
    print(f"Precision (Weighted):  {precision_w * 100:.2f}% (Macro: {precision_m * 100:.2f}%)")
    print(f"Recall (Weighted):     {recall_w * 100:.2f}% (Macro: {recall_m * 100:.2f}%)")
    print(f"F1 Score (Weighted):   {f1_w * 100:.2f}% (Macro: {f1_m * 100:.2f}%)")
    print("-------------------------------------------------------")

    # 5. Generate confusion matrix
    cm = confusion_matrix(all_targets, all_preds)
    cm_path = plot_confusion_matrix(cm, class_names, results_dir)
    print(f"Confusion matrix saved to: {cm_path}")

    # 6. Generate and save classification report text
    report = classification_report(
        all_targets,
        all_preds,
        target_names=class_names,
        digits=4,
        zero_division=0,
    )
    report_path = os.path.join(results_dir, "classification_report.txt")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("AgriVision AI - Plant Disease Classification Report\n")
        f.write("=" * 60 + "\n")
        f.write(f"Test Accuracy:        {test_acc * 100:.2f}%\n")
        f.write(f"Precision (Weighted): {precision_w * 100:.2f}%\n")
        f.write(f"Recall (Weighted):    {recall_w * 100:.2f}%\n")
        f.write(f"F1 Score (Weighted):  {f1_w * 100:.2f}%\n\n")
        f.write(report)
    print(f"Full classification report saved to: {report_path}")

    # Also render loss/accuracy curves if training_history.json exists
    history_file = os.path.join(results_dir, "training_history.json")
    if os.path.exists(history_file):
        history = load_json(history_file)
        plot_training_curves(history, results_dir)
        print("Updated loss and accuracy curve graphs.")

    return {
        "accuracy": test_acc,
        "precision": precision_w,
        "recall": recall_w,
        "f1": f1_w,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate AgriVision AI Plant Disease Model")
    parser.add_argument("--model-path", type=str, default="models/plant_disease_model.pth")
    parser.add_argument("--class-names", type=str, default="models/class_names.json")
    parser.add_argument("--data-dir", type=str, default="data/PlantVillage")
    parser.add_argument("--results-dir", type=str, default="ml/results")
    args = parser.parse_args()

    evaluate_model(
        model_path=args.model_path,
        class_names_path=args.class_names,
        data_dir=args.data_dir,
        results_dir=args.results_dir,
    )
