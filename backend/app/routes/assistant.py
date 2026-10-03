from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from rag.retriever import query_agricultural_assistant

router = APIRouter()


class AssistantRequest(BaseModel):
    question: str
    crop: Optional[str] = None
    disease: Optional[str] = None


class SourceItem(BaseModel):
    title: str
    source: str
    url: Optional[str] = None
    relevance: Optional[str] = None


class AssistantResponse(BaseModel):
    answer: str
    sources: List[SourceItem]
    disclaimer: str


@router.post("/assistant", response_model=AssistantResponse)
def ask_agricultural_assistant(req: AssistantRequest):
    """
    Retrieval-Augmented Generation (RAG) endpoint for agricultural disease guidance.
    Searches authoritative agricultural documents and generates grounded answers with source citations.
    """
    if not req.question or not req.question.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid question for the agricultural assistant."
        )

    try:
        res = query_agricultural_assistant(
            question=req.question.strip(),
            context_crop=req.crop,
            context_disease=req.disease,
            top_k=3,
        )
        return res
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while querying the RAG knowledge base: {str(e)}"
        )
