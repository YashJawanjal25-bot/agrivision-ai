/**
 * AgriVision AI - Real API Service Layer (Stage 4)
 *
 * Communicates with the FastAPI prediction engine (POST /predict, GET /health, POST /assistant).
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Checks connectivity and model availability from the backend.
 * @returns {Promise<{ status: string, model_available: boolean }>}
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) {
      return { status: "error", model_available: false };
    }
    return await res.json();
  } catch (error) {
    return { status: "offline", model_available: false, error: error.message };
  }
}

/**
 * Sends a plant leaf image to the FastAPI PyTorch backend for real disease prediction.
 *
 * @param {File} imageFile - JPG, JPEG, or PNG plant leaf image (<= 10MB)
 * @returns {Promise<Object>} Structured prediction output with agronomic guidance
 */
export async function analyzePlantImage(imageFile) {
  // 1. Client-side validation
  if (!imageFile) {
    throw new Error("No image file provided for analysis.");
  }

  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  if (imageFile.size > MAX_SIZE) {
    const sizeMB = (imageFile.size / (1024 * 1024)).toFixed(2);
    throw new Error(`Image file exceeds 10 MB limit (${sizeMB} MB). Please upload a smaller image.`);
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  const filename = imageFile.name.toLowerCase();
  const validExtension = filename.endsWith(".jpg") || filename.endsWith(".jpeg") || filename.endsWith(".png");

  if (!allowedTypes.includes(imageFile.type.toLowerCase()) && !validExtension) {
    throw new Error("Invalid file format. Please upload a JPG, JPEG, or PNG image.");
  }

  // 2. Prepare multipart form data
  const formData = new FormData();
  formData.append("file", imageFile);

  // 3. Send request to FastAPI /predict
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: formData,
    });
  } catch (netError) {
    throw new Error(
      "Cannot connect to the AgriVision AI prediction server. " +
      "Please ensure the FastAPI backend is running (python -m uvicorn backend.app.main:app --port 8000)."
    );
  }

  // 4. Handle non-200 responses
  if (!response.ok) {
    let errorDetail = "Disease prediction request failed.";
    try {
      const errJson = await response.json();
      if (errJson && errJson.detail) {
        errorDetail = errJson.detail;
      }
    } catch (_) {}

    // Special handling for HTTP 503 (model awaiting training)
    if (response.status === 503) {
      const err = new Error(errorDetail);
      err.isModelNotTrained = true;
      throw err;
    }

    throw new Error(errorDetail);
  }

  // 5. Parse and return real model response
  const data = await response.json();

  return {
    ...data,
    isRealPrediction: true,
    fileName: imageFile.name,
    fileSize: imageFile.size,
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * Queries the RAG Agricultural Assistant endpoint (POST /assistant).
 *
 * @param {string} question - Question string
 * @param {string} [crop] - Optional crop name context
 * @param {string} [disease] - Optional disease context
 * @returns {Promise<{ answer: string, sources: Array, disclaimer: string }>}
 */
export async function askAgriculturalAssistant(question, crop = null, disease = null) {
  if (!question || !question.trim()) {
    throw new Error("Please enter a valid question for the assistant.");
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/assistant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question.trim(),
        crop: crop || null,
        disease: disease || null,
      }),
    });
  } catch (netError) {
    throw new Error(
      "Cannot connect to the AgriVision AI Assistant backend. " +
      "Please verify the FastAPI server is running."
    );
  }

  if (!response.ok) {
    let errorDetail = "Failed to query agricultural assistant.";
    try {
      const errJson = await response.json();
      if (errJson && errJson.detail) {
        errorDetail = errJson.detail;
      }
    } catch (_) {}
    throw new Error(errorDetail);
  }

  return await response.json();
}
