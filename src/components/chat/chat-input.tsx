"use client"

import type React from "react";
import { ChatContext } from "@/context/chat/ChatContext";
import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatInput() {
  const [input, setInput] = useState("");
  const { conversationDispatch } = useContext(ChatContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Handle submission logic here
    conversationDispatch({
      type: "ADD_MESSAGE",
      payload: { role: "user", content: input },
    });
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
