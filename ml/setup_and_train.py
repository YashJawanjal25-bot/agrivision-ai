"""
AgriVision AI — Pre-Trained Model Downloader
=============================================

Downloads the PlantVillage dataset from HuggingFace (mohanty/PlantVillage),
organises it into the required data/PlantVillage/<ClassName>/ folder structure,
and trains a ResNet-18 classifier on it.

Run from the project root (c:\\antigravity):
    python ml/setup_and_train.py

The script will:
1. Install any missing packages
2. Download the dataset (~700 MB)
3. Convert to folder structure
4. Train ResNet-18 (10 epochs on CPU, ~90 min)
5. Save models/plant_disease_model.pth and models/class_names.json
"""

import json
import os
import shutil
import sys
import time
import subprocess

DATA_DIR = os.path.join("data", "PlantVillage")
MODELS_DIR = "models"


def ensure_packages():
    required = ["datasets", "Pillow"]
    for pkg in required:
        try:
            __import__(pkg.lower().replace("-", "_"))
        except ImportError:
            print(f"[setup] Installing {pkg}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", pkg, "-q"])


def download_dataset():
    """Download PlantVillage from HuggingFace and save to data/PlantVillage/."""
    from datasets import load_dataset
    from PIL import Image as PILImage

    if os.path.exists(DATA_DIR) and len(os.listdir(DATA_DIR)) > 1:
        print(f"[setup] Dataset already found at '{DATA_DIR}'. Skipping download.")
        return

    print("[setup] Downloading PlantVillage from HuggingFace (mohanty/PlantVillage)...")
    print("[setup] This may take 5-15 minutes depending on your internet speed...")

    # Load with streaming to avoid memory issues
    ds = load_dataset("mohanty/PlantVillage", trust_remote_code=True)

    # Combine all splits
    all_splits = []
    for split_name in ds.keys():
        all_splits.append(ds[split_name])

    from datasets import concatenate_datasets
    full_dataset = concatenate_datasets(all_splits)

    print(f"[setup] Downloaded {len(full_dataset)} total images.")
    print(f"[setup] Saving images to folder structure under '{DATA_DIR}'...")

    saved = 0
    skipped = 0
    for row in full_dataset:
        label_name = row["label"]
        if isinstance(label_name, int):
            label_name = full_dataset.features["label"].int2str(label_name)

        class_dir = os.path.join(DATA_DIR, label_name)
        os.makedirs(class_dir, exist_ok=True)

        img = row["image"]
        if not isinstance(img, PILImage.Image):
            skipped += 1
            continue

        # Save image as JPEG
        filename = f"{label_name}_{saved:06d}.jpg"
        filepath = os.path.join(class_dir, filename)
        if not os.path.exists(filepath):
            img.convert("RGB").save(filepath, "JPEG", quality=90)
        saved += 1

        if saved % 1000 == 0:
            print(f"[setup]   Saved {saved} images...")

    print(f"[setup] ✓ Dataset organized: {saved} images across {len(os.listdir(DATA_DIR))} classes")


def run_training():
    """Run the training pipeline."""
    print("\n[setup] Starting model training...")
    print("[setup] Training ResNet-18 on PlantVillage dataset (10 epochs, CPU)")
    print("[setup] Estimated time: 60-120 minutes on CPU\n")

    result = subprocess.run(
        [sys.executable, "ml/train.py", "--epochs", "10", "--batch-size", "32"],
        cwd=os.path.dirname(os.path.dirname(os.path.abspath(__file__))) if __name__ != "__main__" else ".",
    )
    return result.returncode == 0


if __name__ == "__main__":
    print("=" * 60)
    print("  AgriVision AI — Dataset Download & Training Setup")
    print("=" * 60)

    # 1. Ensure packages
    ensure_packages()

    # 2. Download dataset
    download_dataset()

    # 3. Check dataset is ready
    if not os.path.exists(DATA_DIR) or not os.listdir(DATA_DIR):
        print("[ERROR] Dataset could not be downloaded. Exiting.")
        sys.exit(1)

    class_count = len([d for d in os.listdir(DATA_DIR)
                       if os.path.isdir(os.path.join(DATA_DIR, d))])
    print(f"\n[setup] ✓ Dataset ready: {class_count} plant disease classes detected")

    # 4. Train
    success = run_training()
    if success:
        print("\n✓ Training complete!")
        print(f"  Model saved to:       models/plant_disease_model.pth")
        print(f"  Class names saved to: models/class_names.json")
        print("\nRestart FastAPI and you're ready:")
        print("  python -m uvicorn backend.app.main:app --port 8000 --reload")
    else:
        print("\n[ERROR] Training failed. Check output above for details.")
