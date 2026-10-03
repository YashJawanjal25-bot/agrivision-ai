import os
import torch
from torch.utils.data import Dataset, DataLoader, random_split
from torchvision import datasets, transforms
from PIL import Image

# Standard ImageNet normalization parameters
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]
IMAGE_SIZE = 224


def get_train_transforms():
    """Data augmentation pipeline for training."""
    return transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.RandomResizedCrop(IMAGE_SIZE, scale=(0.8, 1.0)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.15),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])


def get_eval_transforms():
    """Deterministic preprocessing pipeline for validation, testing, and inference."""
    return transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.CenterCrop(IMAGE_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])


class TransformedSubset(Dataset):
    """
    Wrapper around a torch.utils.data.Subset that applies a specific transform
    to images on-the-fly.
    """
    def __init__(self, subset, transform=None):
        self.subset = subset
        self.transform = transform

    def __getitem__(self, index):
        x, y = self.subset[index]
        # x is a PIL image when base ImageFolder has transform=None
        if self.transform is not None:
            x = self.transform(x)
        return x, y

    def __len__(self):
        return len(self.subset)


def load_plant_dataset(
    data_dir="data/PlantVillage",
    train_ratio=0.70,
    val_ratio=0.15,
    test_ratio=0.15,
    batch_size=32,
    seed=42,
    num_workers=0
):
    """
    Scans the data directory, detects all class subfolders, creates reproducible
    70/15/15 train/val/test splits, and returns data loaders alongside class metadata.

    Returns:
        (train_loader, val_loader, test_loader, class_names, split_counts)
    """
    if not os.path.exists(data_dir):
        raise FileNotFoundError(
            f"Dataset directory '{data_dir}' not found. "
            "Please download the PlantVillage dataset and place class folders in 'data/PlantVillage'."
        )

    # Base dataset without transforms
    base_dataset = datasets.ImageFolder(root=data_dir, transform=None)
    class_names = base_dataset.classes
    total_images = len(base_dataset)

    if total_images == 0:
        raise ValueError(
            f"Dataset directory '{data_dir}' is empty or contains no valid images. "
            "Ensure subdirectories containing .jpg/.png plant images exist."
        )

    # Calculate split lengths (70% train, 15% val, 15% test)
    train_len = int(train_ratio * total_images)
    val_len = int(val_ratio * total_images)
    test_len = total_images - train_len - val_len

    # Reproducible random split
    generator = torch.Generator().manual_seed(seed)
    train_subset, val_subset, test_subset = random_split(
        base_dataset,
        [train_len, val_len, test_len],
        generator=generator
    )

    # Wrap subsets with respective augmentations
    train_dataset = TransformedSubset(train_subset, transform=get_train_transforms())
    val_dataset = TransformedSubset(val_subset, transform=get_eval_transforms())
    test_dataset = TransformedSubset(test_subset, transform=get_eval_transforms())

    # Build DataLoader instances
    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
        pin_memory=torch.cuda.is_available(),
    )
    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=torch.cuda.is_available(),
    )
    test_loader = DataLoader(
        test_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=torch.cuda.is_available(),
    )

    split_counts = {
        "total_images": total_images,
        "num_classes": len(class_names),
        "train_count": len(train_subset),
        "val_count": len(val_subset),
        "test_count": len(test_subset),
    }

    return train_loader, val_loader, test_loader, class_names, split_counts
