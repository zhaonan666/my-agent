from app.schema.base import BaseResponse
from app.schema.chat import ChatRequest
from app.service.chat import chat_with_agent
from fastapi import APIRouter

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("")
async def chat(payload: ChatRequest) -> BaseResponse:
    answer = await chat_with_agent(payload.message)
    return BaseResponse(code=200, message="Success", data=answer)
