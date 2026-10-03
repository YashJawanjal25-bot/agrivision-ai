import os

RAG_DIR = os.path.dirname(os.path.abspath(__file__))
DOCUMENTS_DIR = os.path.join(RAG_DIR, "documents")
KNOWLEDGE_BASE_FILE = os.path.join(DOCUMENTS_DIR, "agricultural_knowledge.json")

DEFAULT_TOP_K = 3
CONFIDENCE_THRESHOLD = 0.60  # 60% confidence threshold for low-confidence warnings
