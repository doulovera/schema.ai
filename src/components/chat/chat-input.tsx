"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/chat";

export function ChatInput() {
  const { createNewChat } = useChatStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = (e.currentTarget.elements[0] as HTMLInputElement).value;
    if (!message.trim()) return;

    await createNewChat(message);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Write your specifications..."
        className="flex-1"
      />
      <Button type="submit" size="sm">
        Send
      </Button>
    </form>
  );
}
