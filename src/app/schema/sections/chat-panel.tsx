import { ConversationView } from "@/components/chat/conversation-view";
import { ChatInput } from "@/components/chat/chat-input";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function Chat({ hidePanel }: { hidePanel: () => void }) {
  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">Chat</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={hidePanel}
          aria-label="Ocultar Espacio 1"
        >
          <ChevronLeft className="" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        <div className="flex flex-col h-full w-full">
          <div className="flex-1 overflow-auto p-4">
            <ConversationView />
          </div>
          <div className="p-4 border-t">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
}
