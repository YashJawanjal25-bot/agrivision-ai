import argparse
import os
import sys
import time
import torch
import torch.nn as nn
import torch.optim as optim

from ml.dataset import load_plant_dataset
from ml.model import create_model
from ml.utils import get_device, save_json, plot_training_curves


def train_model(
    data_dir="data/PlantVillage",
    models_dir="models",
    results_dir="ml/results",
    epochs=15,
    batch_size=32,
    lr=0.0003,
    weight_decay=1e-4,
):
    """
    Executes the PyTorch training pipeline on the PlantVillage dataset.
    """
    device = get_device()

    print("\n=======================================================")
    print("      AgriVision AI - Plant Disease Model Training     ")
    print("=======================================================")

    # 1. Load dataset with reproducible 70/15/15 splits
    try:
        train_loader, val_loader, test_loader, class_names, split_counts = load_plant_dataset(
            data_dir=data_dir,
            train_ratio=0.70,
            val_ratio=0.15,
            test_ratio=0.15,
            batch_size=batch_size,
        )
    except (FileNotFoundError, ValueError) as err:
        print(f"\n[ERROR] Dataset error: {err}")
        print("\nTo train the model:")
        print(f"1. Download the PlantVillage dataset.")
        print(f"2. Extract class folders into '{os.path.abspath(data_dir)}'.")
        print("3. Re-run: python ml/train.py\n")
        sys.exit(1)

    # Print required dataset statistics
    print(f"Device being used:   {device}")
    print(f"Number of classes:   {split_counts['num_classes']}")
    print(f"Total images:        {split_counts['total_images']}")
    print(f"Training images:     {split_counts['train_count']}")
    print(f"Validation images:   {split_counts['val_count']}")
    print(f"Test images:         {split_counts['test_count']}")
    print("-------------------------------------------------------")

    # 2. Save class names to models/class_names.json
    os.makedirs(models_dir, exist_ok=True)
    class_names_path = os.path.join(models_dir, "class_names.json")
    save_json(class_names, class_names_path)
    print(f"Saved class names list to: {class_names_path}")

    # 3. Initialize ResNet-18 model
    model = create_model(num_classes=len(class_names), pretrained=True)
    model.to(device)

    # 4. Loss and Optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr, weight_decay=weight_decay)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode="max", factor=0.5, patience=2)

    best_val_acc = 0.0
    best_model_path = os.path.join(models_dir, "plant_disease_model.pth")

    history = {
        "train_loss": [],
        "val_loss": [],
        "train_acc": [],
        "val_acc": [],
    }

    start_time = time.time()

    print("\nStarting training loop...")
    print(f"{'Epoch':<8} {'Train Loss':<12} {'Train Acc (%)':<15} {'Val Loss':<12} {'Val Acc (%)':<15}")
    print("-" * 62)

    for epoch in range(1, epochs + 1):
        # --- Training Phase ---
        model.train()
        running_train_loss = 0.0
        correct_train = 0
        total_train = 0

        for images, labels in train_loader:
            images = images.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_train_loss += loss.item() * images.size(0)
            _, predicted = torch.max(outputs, 1)
            total_train += labels.size(0)
            correct_train += (predicted == labels).sum().item()

        epoch_train_loss = running_train_loss / total_train
        epoch_train_acc = correct_train / total_train

        # --- Validation Phase ---
        model.eval()
        running_val_loss = 0.0
        correct_val = 0
        total_val = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images = images.to(device)
                labels = labels.to(device)

                outputs = model(images)
                loss = criterion(outputs, labels)

                running_val_loss += loss.item() * images.size(0)
                _, predicted = torch.max(outputs, 1)
                total_val += labels.size(0)
                correct_val += (predicted == labels).sum().item()

        epoch_val_loss = running_val_loss / total_val
        epoch_val_acc = correct_val / total_val

        scheduler.step(epoch_val_acc)

        history["train_loss"].append(epoch_train_loss)
        history["val_loss"].append(epoch_val_loss)
        history["train_acc"].append(epoch_train_acc)
        history["val_acc"].append(epoch_val_acc)

        print(
            f"{epoch:<8} {epoch_train_loss:<12.4f} {epoch_train_acc * 100:<15.2f} "
            f"{epoch_val_loss:<12.4f} {epoch_val_acc * 100:<15.2f}"
        )

        # Checkpoint: Save best model based on validation accuracy
        if epoch_val_acc > best_val_acc:
            best_val_acc = epoch_val_acc
            torch.save(
                {
                    "epoch": epoch,
                    "num_classes": len(class_names),
                    "class_names": class_names,
                    "model_state_dict": model.state_dict(),
                    "val_acc": epoch_val_acc,
                    "val_loss": epoch_val_loss,
                },
                best_model_path,
            )

    elapsed_time = time.time() - start_time
    print("-" * 62)
    print(f"Training completed in {elapsed_time // 60:.0f}m {elapsed_time % 60:.0f}s")
    print(f"Best Validation Accuracy: {best_val_acc * 100:.2f}%")
    print(f"Saved BEST model checkpoint to: {best_model_path}")

    # 5. Save training history and plot curves
    os.makedirs(results_dir, exist_ok=True)
    history_path = os.path.join(results_dir, "training_history.json")
    save_json(history, history_path)
    loss_path, acc_path = plot_training_curves(history, results_dir)
    print(f"Saved training curves to:\n  - {loss_path}\n  - {acc_path}")

    return best_model_path, class_names_path


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train AgriVision AI ResNet-18 Plant Disease Model")
    parser.add_argument("--data-dir", type=str, default="data/PlantVillage", help="Path to PlantVillage data folder")
    parser.add_argument("--epochs", type=int, default=10, help="Number of training epochs")
    parser.add_argument("--batch-size", type=int, default=32, help="Batch size for training")
    parser.add_argument("--lr", type=float, default=0.0003, help="Learning rate")
    args = parser.parse_args()

    train_model(
        data_dir=args.data_dir,
        epochs=args.epochs,
        batch_size=args.batch_size,
        lr=args.lr,
    )
