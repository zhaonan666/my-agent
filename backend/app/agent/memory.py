from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()


def get_memory_config(thread_id: str):
    return {"configurable": {"thread_id": thread_id}}
