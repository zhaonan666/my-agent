from app.agent.agent import agent

result = agent.invoke(
    {
        "messages": [
            {
                "role": "user",
                "content": "现在几点？",
            }
        ]
    }
)

print(result["messages"][-1].content)
