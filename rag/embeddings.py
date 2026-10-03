import json
import os
import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from rag.config import KNOWLEDGE_BASE_FILE

DISEASE_INFO_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "disease_information.json")

_vectorizer = None
_tfidf_matrix = None
_documents = []


def _clean_text(text: str) -> str:
    """Lowercase, remove special characters, and normalize whitespace."""
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def _build_corpus_entry(doc: dict) -> str:
    """
    Build a high-signal search index string:
    - Title & Crop repeated 4x
    - Topic repeated 3x
    - Content/Advice repeated 2x
    """
    title = _clean_text(doc.get("title", ""))
    crop = _clean_text(doc.get("crop", ""))
    topic = _clean_text(doc.get("topic", ""))
    content = _clean_text(doc.get("content", ""))

    return f"{title} {title} {title} {title} {crop} {crop} {crop} {crop} {topic} {topic} {topic} {content} {content}"


def load_knowledge_documents():
    """
    Loads and unifies documents from both:
    1. rag/documents/agricultural_knowledge.json (extension research papers)
    2. data/disease_information.json (38+ PlantVillage and Rice disease entries)
    """
    global _documents
    if _documents:
        return _documents

    all_docs = []

    # 1. Load agricultural extension documents
    if os.path.exists(KNOWLEDGE_BASE_FILE):
        try:
            with open(KNOWLEDGE_BASE_FILE, "r", encoding="utf-8") as f:
                extension_docs = json.load(f)
                all_docs.extend(extension_docs)
        except Exception as e:
            print(f"[RAG] Error loading agricultural_knowledge.json: {e}")

    # 2. Load and convert disease_information.json entries into searchable knowledge documents
    if os.path.exists(DISEASE_INFO_FILE):
        try:
            with open(DISEASE_INFO_FILE, "r", encoding="utf-8") as f:
                disease_db = json.load(f)

            for key, info in disease_db.items():
                plant = info.get("plant", "Crop")
                disease = info.get("disease", "Condition")
                symptoms = " ".join(info.get("symptoms", []))
                causes = " ".join(info.get("causes", []))
                treatment = " ".join(info.get("treatment", []))
                prevention = " ".join(info.get("prevention", []))
                advice = " ".join(info.get("agricultural_advice", []))

                doc_id = f"diag_{key}"
                title = f"{plant} {disease} Agronomic & Pathology Guide"
                topic = f"{plant} {disease} symptoms causes treatment prevention solutions"
                content = (
                    f"{plant} affected by {disease}. "
                    f"Symptoms: {symptoms}. "
                    f"Causes: {causes}. "
                    f"Treatment & Solutions: {treatment}. "
                    f"Prevention & Management: {prevention}. "
                    f"Agricultural Advice: {advice}"
                )

                all_docs.append({
                    "id": doc_id,
                    "title": title,
                    "source": "AgriVision Diagnostic Knowledge Base & Plant Pathology Repository",
                    "url": "https://agrivision.ai/knowledge/plant-diseases",
                    "crop": plant,
                    "topic": topic,
                    "content": content,
                    "structured": {
                        "plant": plant,
                        "disease": disease,
                        "symptoms": info.get("symptoms", []),
                        "causes": info.get("causes", []),
                        "treatment": info.get("treatment", []),
                        "prevention": info.get("prevention", []),
                        "advice": info.get("agricultural_advice", []),
                    }
                })
        except Exception as e:
            print(f"[RAG] Error loading disease_information.json: {e}")

    _documents = all_docs
    print(f"[RAG] Total knowledge documents indexed: {len(_documents)}")
    return _documents


def initialize_search_index():
    """Builds TF-IDF vector matrix over the combined corpus."""
    global _vectorizer, _tfidf_matrix, _documents

    docs = load_knowledge_documents()
    if not docs:
        return False

    corpus = [_build_corpus_entry(doc) for doc in docs]

    _vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 3),
        min_df=1,
        max_df=0.98,
        sublinear_tf=True,
    )
    _tfidf_matrix = _vectorizer.fit_transform(corpus)
    return True


def search_documents(query: str, top_k: int = 5):
    """
    Performs vector similarity search against the knowledge corpus.
    """
    global _vectorizer, _tfidf_matrix, _documents

    if _vectorizer is None or _tfidf_matrix is None:
        initialized = initialize_search_index()
        if not initialized:
            return []

    cleaned_query = _clean_text(query)
    if not cleaned_query:
        return []

    query_vec = _vectorizer.transform([cleaned_query])
    similarities = cosine_similarity(query_vec, _tfidf_matrix).flatten()

    top_indices = np.argsort(similarities)[::-1][:top_k]

    results = []
    for idx in top_indices:
        score = float(similarities[idx])
        doc = _documents[idx]
        results.append({
            "id": doc.get("id"),
            "title": doc.get("title"),
            "source": doc.get("source"),
            "url": doc.get("url", ""),
            "crop": doc.get("crop"),
            "topic": doc.get("topic"),
            "content": doc.get("content"),
            "structured": doc.get("structured"),
            "similarity_score": round(score, 4),
        })

    return results
