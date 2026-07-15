from app.schema.base import BaseResponse
from app.schema.chat import ChatRequest
from app.service.chat import chat_with_agent, chat_with_agent_stream
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("")
async def chat(payload: ChatRequest) -> StreamingResponse:
    answer = await chat_with_agent(payload.message, payload.thread_id)
    return BaseResponse(code=200, message="Success", data=answer)


@router.post("/stream")
async def chat_stream(payload: ChatRequest) -> BaseResponse:
    return StreamingResponse(
        chat_with_agent_stream(payload.message, payload.thread_id),
        media_type="text/event-stream",
    )
