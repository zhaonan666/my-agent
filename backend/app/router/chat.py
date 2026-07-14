from app.schema.chat import ChatRequest, ChatResponse
from app.service.chat import chat_with_agent
from fastapi import APIRouter

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("")
async def chat(payload: ChatRequest) -> ChatResponse:
    answer, tools_used = await chat_with_agent(payload.message)
    return ChatResponse(answer=answer, tools_used=tools_used)
