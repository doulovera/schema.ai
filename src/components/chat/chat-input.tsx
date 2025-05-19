"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/chat";
import { useParams } from "next/navigation";

export function ChatInput() {
  const { handleSendMessage } = useChatStore();
  const params = useParams();
  const chatId = params.id as string;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const inputElement = form.elements[0] as HTMLInputElement;
    const message = inputElement.value;

    if (!message.trim() || !chatId) return;

    form.reset();
    await handleSendMessage(message, chatId);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input placeholder="Write your specifications..." className="flex-1" />
      <Button type="submit" size="sm">
        Send
      </Button>
    </form>
  );
}
