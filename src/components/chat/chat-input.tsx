"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/chat";
import { useParams } from "next/navigation";

export function ChatInput() {
  const { handleSendMessage, isLoading } = useChatStore();
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
      <Input placeholder="Write your specifications..." className="flex-1 py-6" disabled={isLoading} required />
      <Button type="submit" className="py-6" disabled={isLoading}>
        Send
      </Button>
    </form>
  );
}
