interface StreamEvent {
  type: "token" | "done" | "error";
  content?: string;
  message?: string;
}
export async function streamChat(
  message: string,
  threadId: string,
  onToken: (content: string) => void,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/chat/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        message,
        thread_id: threadId,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`请求失败：${response.status}`);
  }

  if (!response.body) {
    throw new Error("响应体为空");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    // 把二进制数据转换成字符串
    buffer += decoder.decode(value, {
      stream: true,
    });

    // 每条 SSE 消息通过两个换行分隔
    const blocks = buffer.split("\n\n");

    buffer = blocks.pop() ?? "";

    for (const block of blocks) {
      if (!block.startsWith("data:")) {
        continue;
      }

      // 去掉前面的 data:
      const jsonText = block.slice("data:".length).trim();

      const event = JSON.parse(jsonText) as StreamEvent;

      if (event.type === "token" && event.content) {
        onToken(event.content);
      }

      if (event.type === "done") {
        console.log("回答结束");
      }

      if (event.type === "error") {
        throw new Error(event.message ?? "流式请求失败");
      }
    }
  }
}
