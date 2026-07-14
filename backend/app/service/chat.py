from app.agent.agent import agent
from langchain_core.messages import HumanMessage, ToolMessage


async def chat_with_agent(user_message: str) -> tuple[str, list[str]]:
    result = await agent.ainvoke({"messages": [HumanMessage(content=user_message)]})
    messages = result["messages"]
    answer = messages[-1].content
    tools_used = []
    for message in messages:
        if isinstance(message, ToolMessage):
            tools_used.append(message.name)

    return answer, tools_used
