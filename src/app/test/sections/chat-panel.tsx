import { ConversationView } from "@/components/chat/conversation-view";
import { ChatInput } from "@/components/chat/chat-input";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

export default function Chat({ conversation, setShowEspacio1 }) {
  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">Panel Izquierdo</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowEspacio1(false)}
          aria-label="Ocultar Espacio 1"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        <div className="flex flex-col h-full w-full">
          <div className="flex-1 overflow-auto p-4">
            <ConversationView messages={conversation.messages} />
          </div>
          <div className="p-4 border-t">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
}
