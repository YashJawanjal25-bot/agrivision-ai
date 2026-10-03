import json
import os

DISEASE_INFO_FILE = os.path.join("data", "disease_information.json")
_cached_disease_info = None


def get_all_disease_info():
    """Loads and caches the agricultural disease information database."""
    global _cached_disease_info
    if _cached_disease_info is None:
        if os.path.exists(DISEASE_INFO_FILE):
            try:
                with open(DISEASE_INFO_FILE, "r", encoding="utf-8") as f:
                    _cached_disease_info = json.load(f)
            except Exception as e:
                print(f"[AgriVision AI] Warning: Failed to parse {DISEASE_INFO_FILE}: {e}")
                _cached_disease_info = {}
        else:
            _cached_disease_info = {}
    return _cached_disease_info


def get_disease_details(class_name):
    """
    Retrieves symptoms, causes, treatments, prevention, and agricultural advice
    for a given PlantVillage class name.

    Returns a dict with standard keys.
    """
    db = get_all_disease_info()

    if class_name in db:
        info = db[class_name]
        return {
            "plant": info.get("plant", "Plant"),
            "disease": info.get("disease", class_name.replace("___", " - ").replace("_", " ")),
            "symptoms": info.get("symptoms", []),
            "causes": info.get("causes", []),
            "treatment": info.get("treatment", []),
            "prevention": info.get("prevention", []),
            "agricultural_advice": info.get("agricultural_advice", []),
        }

    # Fallback parsing if class is not in the knowledge base
    if "___" in class_name:
        plant_raw, disease_raw = class_name.split("___", 1)
        plant = plant_raw.replace("_", " ").title()
        disease = disease_raw.replace("_", " ").title()
    else:
        plant = "Identified Crop"
        disease = class_name.replace("_", " ").title()

    is_healthy = "healthy" in class_name.lower()

    return {
        "plant": plant,
        "disease": disease,
        "symptoms": [
            "Foliar symptom detected matching neural classification profile."
            if not is_healthy
            else "Leaf shows uniform pigmentation and healthy tissue."
        ],
        "causes": [
            "Environmental or microbiological pathogen identified by computer vision."
            if not is_healthy
            else "Balanced irrigation and optimal growing conditions."
        ],
        "treatment": [
            "Consult local agricultural extension service for certified regional treatment."
            if not is_healthy
            else "No chemical or biological treatment needed."
        ],
        "prevention": [
            "Ensure proper plant spacing, avoid overhead watering, and monitor field daily."
        ],
        "agricultural_advice": [
            "Regular scouting and prompt removal of infected leaves will protect the broader crop."
        ],
    }
