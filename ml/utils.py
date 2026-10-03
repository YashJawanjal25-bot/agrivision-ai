import json
import os
import torch


def get_device():
    """Detect and return CUDA GPU device if available, otherwise CPU."""
    if torch.cuda.is_available():
        return torch.device("cuda")
    return torch.device("cpu")


def save_json(data, filepath):
    """Save dictionary/list to a JSON file."""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def load_json(filepath):
    """Load JSON file and return parsed content."""
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def plot_training_curves(history, output_dir):
    """
    Generate and save loss and accuracy curves (lazy imports matplotlib).
    """
    import matplotlib.pyplot as plt

    os.makedirs(output_dir, exist_ok=True)
    epochs = range(1, len(history["train_loss"]) + 1)

    # 1. Loss Curve
    plt.figure(figsize=(8, 5))
    plt.plot(epochs, history["train_loss"], "b-o", label="Training Loss")
    plt.plot(epochs, history["val_loss"], "r--s", label="Validation Loss")
    plt.title("Training and Validation Loss Curve", fontsize=14, fontweight="bold")
    plt.xlabel("Epoch", fontsize=12)
    plt.ylabel("CrossEntropy Loss", fontsize=12)
    plt.grid(True, linestyle="--", alpha=0.6)
    plt.legend(fontsize=11)
    loss_path = os.path.join(output_dir, "loss_curve.png")
    plt.tight_layout()
    plt.savefig(loss_path, dpi=300)
    plt.close()

    # 2. Accuracy Curve
    plt.figure(figsize=(8, 5))
    plt.plot(epochs, [a * 100 for a in history["train_acc"]], "g-o", label="Training Accuracy (%)")
    plt.plot(epochs, [a * 100 for a in history["val_acc"]], "m--s", label="Validation Accuracy (%)")
    plt.title("Training and Validation Accuracy Curve", fontsize=14, fontweight="bold")
    plt.xlabel("Epoch", fontsize=12)
    plt.ylabel("Accuracy (%)", fontsize=12)
    plt.grid(True, linestyle="--", alpha=0.6)
    plt.legend(fontsize=11)
    acc_path = os.path.join(output_dir, "accuracy_curve.png")
    plt.tight_layout()
    plt.savefig(acc_path, dpi=300)
    plt.close()

    return loss_path, acc_path


def plot_confusion_matrix(cm, class_names, output_dir):
    """Generate and save confusion matrix heatmap (lazy imports matplotlib/seaborn)."""
    import matplotlib.pyplot as plt
    import seaborn as sns

    os.makedirs(output_dir, exist_ok=True)
    fig_size = max(10, len(class_names) * 0.4)
    plt.figure(figsize=(fig_size, fig_size))
    sns.heatmap(
        cm,
        annot=len(class_names) <= 20,
        fmt="d",
        cmap="Greens",
        xticklabels=class_names,
        yticklabels=class_names,
        cbar=True,
    )
    plt.title("Plant Disease Classification Confusion Matrix", fontsize=14, fontweight="bold")
    plt.xlabel("Predicted Class", fontsize=12)
    plt.ylabel("True Class", fontsize=12)
    plt.xticks(rotation=90, fontsize=8)
    plt.yticks(rotation=0, fontsize=8)
    cm_path = os.path.join(output_dir, "confusion_matrix.png")
    plt.tight_layout()
    plt.savefig(cm_path, dpi=300)
    plt.close()
    return cm_path
