from rag.embeddings import search_documents
from rag.config import DEFAULT_TOP_K

SAFETY_DISCLAIMER = (
    "Agricultural Safety Notice: For chemical interventions (fungicides, bactericides, insecticides), "
    "always adhere strictly to official product label instructions and local agricultural extension regulations."
)

RELEVANCE_THRESHOLD = 0.08


def _detect_question_intent(question: str):
    """
    Detects question intent: symptoms, treatment, prevention, causes, monitoring, or general.
    """
    q = question.lower()
    if any(w in q for w in ["symptom", "sign", "identify", "look like", "what does", "appear", "mark", "spot", "lesion"]):
        return "symptoms"
    if any(w in q for w in ["treat", "cure", "control", "manage", "fix", "fungicide", "pesticide", "remedy", "stop", "solution"]):
        return "treatment"
    if any(w in q for w in ["prevent", "avoid", "protect", "reduce risk", "resistant", "guard"]):
        return "prevention"
    if any(w in q for w in ["cause", "why", "reason", "origin", "spread", "pathogen", "disease from"]):
        return "causes"
    if any(w in q for w in ["inspect", "scout", "monitor", "check", "how often", "frequency", "schedule"]):
        return "monitoring"
    return "general"


def format_rag_answer(question: str, search_results: list):
    """
    Synthesizes a structured, highly informative, and grounded agronomic answer.
    """
    if not search_results:
        return {
            "answer": (
                "I do not have sufficient grounded agricultural information in my knowledge base to answer this specific question accurately. "
                "Please consult a local agricultural extension specialist or certified agronomist for guidance."
            ),
            "sources": [],
            "disclaimer": SAFETY_DISCLAIMER,
        }

    relevant_docs = [r for r in search_results if r["similarity_score"] >= RELEVANCE_THRESHOLD]

    if not relevant_docs:
        best = search_results[0]
        return {
            "answer": (
                f"I could not find directly matching agricultural research for your exact query. "
                f"The closest topic in our knowledge base is '{best.get('title', 'General Crop Health')}' (Relevance: {best.get('similarity_score', 0)*100:.1f}%).\n\n"
                f"For reliable guidance, please consult:\n"
                f"• Your local agricultural university extension office\n"
                f"• FAO Crop Protection Portal (www.fao.org)\n"
                f"• A certified agronomist or plant pathologist"
            ),
            "sources": [],
            "disclaimer": SAFETY_DISCLAIMER,
        }

    top_doc = relevant_docs[0]
    intent = _detect_question_intent(question)
    sources = []

    for doc in relevant_docs[:3]:
        sources.append({
            "title": doc["title"],
            "source": doc["source"],
            "url": doc.get("url", ""),
            "relevance": f"{doc['similarity_score'] * 100:.1f}%",
        })

    # If the top document has structured field data from disease_information.json
    structured = top_doc.get("structured")
    if structured and intent != "general":
        plant = structured.get("plant", "Crop")
        disease = structured.get("disease", "Condition")

        if intent == "symptoms":
            symptoms = structured.get("symptoms", [])
            lines = [f"### Key Symptoms of {plant} {disease}"]
            for s in symptoms:
                lines.append(f"• {s}")
            lines.append("\n**Identification Tip:** Look for pattern progression from lower mature leaves to upper canopy.")
            answer_text = "\n".join(lines)

        elif intent == "treatment":
            treatment = structured.get("treatment", [])
            advice = structured.get("advice", [])
            lines = [f"### Treatment & Management Protocol for {plant} {disease}"]
            for t in treatment:
                lines.append(f"• {t}")
            if advice:
                lines.append("\n**Agronomic Advice:**")
                for a in advice:
                    lines.append(f"• {a}")
            answer_text = "\n".join(lines)

        elif intent == "prevention":
            prevention = structured.get("prevention", [])
            lines = [f"### Prevention & Cultural Practices for {plant} {disease}"]
            for p in prevention:
                lines.append(f"• {p}")
            answer_text = "\n".join(lines)

        elif intent == "causes":
            causes = structured.get("causes", [])
            lines = [f"### Pathogen & Environmental Causes of {plant} {disease}"]
            for c in causes:
                lines.append(f"• {c}")
            answer_text = "\n".join(lines)

        else:
            answer_text = top_doc["content"]

        # Append additional context from second doc if distinct and relevant
        if len(relevant_docs) > 1 and relevant_docs[1]["id"] != top_doc["id"] and relevant_docs[1]["similarity_score"] > 0.12:
            answer_text += f"\n\n**Additional Research Note ({relevant_docs[1]['source']}):**\n{relevant_docs[1]['content']}"

    else:
        # Fallback to rich paragraph synthesis
        paragraphs = []
        for doc in relevant_docs[:2]:
            paragraphs.append(doc["content"])
        answer_text = "\n\n".join(paragraphs)

    return {
        "answer": answer_text,
        "sources": sources,
        "disclaimer": SAFETY_DISCLAIMER,
    }


def query_agricultural_assistant(question: str, context_crop: str = None, context_disease: str = None, top_k: int = DEFAULT_TOP_K):
    """
    Main RAG query interface.
    Combines user question with optional crop/disease context.
    """
    enhanced_query = question.strip()
    if context_crop or context_disease:
        enhanced_query = f"{context_crop or ''} {context_disease or ''} {question}".strip()

    search_results = search_documents(enhanced_query, top_k=top_k)
    return format_rag_answer(question, search_results)
