import json
from typing import Any

from app.agent.agent import agent
from app.agent.memory import get_memory_config
from langchain_core.messages import HumanMessage, ToolMessage


async def chat_with_agent(user_message: str, thread_id: str) -> str:
    result = await agent.ainvoke(
        {"messages": [HumanMessage(content=user_message)]}, config=get_memory_config(thread_id)
    )
    messages = result["messages"]
    answer = messages[-1].content

    return answer


def format_sse(event_type: str, content: str) -> str:
    payload = {
        "type": event_type,
        "content": content,
    }

    return f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"


async def chat_with_agent_stream(user_message: str, thread_id: str):
    async for chunk in agent.astream(
        {"messages": [HumanMessage(content=user_message)]},
        config=get_memory_config(thread_id),
        stream_mode="messages",
        version="v2",
    ):
        if chunk["type"] != "messages":
            continue

        message_chunk, metadata = chunk["data"]
        yield format_sse("token", message_chunk.content)

    yield format_sse("done", "")
