import io
from PIL import Image
from torchvision import transforms
from fastapi import HTTPException, status

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/jpg", "image/png"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]
IMAGE_SIZE = 224

eval_transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.CenterCrop(IMAGE_SIZE),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
])


async def validate_and_process_image(upload_file):
    """
    Validates uploaded file against size limits and image formats,
    returning a PIL RGB image and a preprocessed PyTorch tensor (1, 3, 224, 224).

    Raises HTTPException on validation failures with user-friendly error messages.
    """
    if not upload_file or not upload_file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image file was provided for analysis."
        )

    # 1. Check filename extension
    filename_lower = upload_file.filename.lower()
    has_valid_ext = any(filename_lower.endswith(ext) for ext in ALLOWED_EXTENSIONS)
    content_type = (upload_file.content_type or "").lower()

    if not has_valid_ext and content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file format '{upload_file.filename}'. Please upload a JPG, JPEG, or PNG image."
        )

    # 2. Read bytes and check size
    contents = await upload_file.read()
    if len(contents) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded image file is empty."
        )

    if len(contents) > MAX_FILE_SIZE:
        size_mb = round(len(contents) / (1024 * 1024), 2)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of 10 MB (uploaded file is {size_mb} MB)."
        )

    # 3. Verify that bytes constitute a valid image
    try:
        pil_image = Image.open(io.BytesIO(contents))
        pil_image.verify()
        # Re-open after verify() as recommended by PIL
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file could not be parsed as a valid image. It may be corrupted."
        )

    # 4. Transform to tensor
    try:
        tensor = eval_transform(pil_image).unsqueeze(0)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to preprocess the plant image for neural inference."
        )

    return pil_image, tensor, len(contents)
