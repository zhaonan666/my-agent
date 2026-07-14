import { Input, Button, message } from "antd";
import { useState } from "react";
import request from "../service/request";

import {
  PlusOutlined,
  AudioOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { Message } from "./_types/chat";

const InputContainer = ({
  setMessages,
}: {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) => {
  const [inputValue, setInputValue] = useState("");
  const handleSendMessage = async () => {
    if (inputValue.trim() === "") {
      return;
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "human", content: inputValue },
    ]);
    setInputValue("");

    const answer =
      (await request.post("/chat", {
        message: inputValue,
      })) || {};

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "ai", content: answer || "抱歉，我没有理解您的问题。" },
    ]);
  };

  return (
    <div className="flex items-center border-1 rounded-xl gap-2  border-gray-300 p-2">
      <Button icon={<PlusOutlined />} type="text" />
      <Input
        placeholder="问问 Agent"
        variant="borderless"
        className="!border-none !shadow-none !outline-none"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onPressEnter={handleSendMessage}
      />
      <Button icon={<AudioOutlined />} type="text" />
      <Button
        icon={<ArrowUpOutlined />}
        type="text"
        onClick={handleSendMessage}
      />
    </div>
  );
};

export default InputContainer;
