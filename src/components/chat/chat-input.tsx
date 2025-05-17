"use client"

import type React from "react";
import { ChatContext } from "@/context/chat/ChatContext";
import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateXML } from "@/lib/gemini-utils";

export function ChatInput() {
  const [input, setInput] = useState("");
  const { setConversationHistory, setXml } = useContext(ChatContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Handle submission logic here
    setConversationHistory((prev) => [
      ...prev,
      { role: "user", content: input },
    ]);

    const response = await generateXML(input); // fetch(api)
    // const response = "test"

    if (response) {
      setXml(response);
      setConversationHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Generado." },
      ]);
    } else {
      setConversationHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Error generating XML" },
      ]);
    }
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Write your specifications..."
        className="flex-1"
      />
      <Button type="submit" size="sm">
        Send
      </Button>
    </form>
  );
}
