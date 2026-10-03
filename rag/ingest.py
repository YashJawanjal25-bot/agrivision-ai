from rag.embeddings import initialize_search_index, load_knowledge_documents


def run_ingestion():
    """Ingestion script to load agricultural documents and initialize TF-IDF search index."""
    print("=======================================================")
    print("      AgriVision AI - RAG Knowledge Base Ingestion     ")
    print("=======================================================")

    docs = load_knowledge_documents()
    print(f"[RAG Ingestion] Loaded {len(docs)} agricultural documents.")

    success = initialize_search_index()
    if success:
        print("[RAG Ingestion] ✓ Successfully built vector similarity index.")
        for idx, doc in enumerate(docs, 1):
            print(f"  {idx}. [{doc.get('crop')}] {doc.get('title')} ({doc.get('source')})")
    else:
        print("[RAG Ingestion] Failed to build search index.")

    return success


if __name__ == "__main__":
    run_ingestion()
