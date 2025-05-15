import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import TabTextSelector from "@/components/chat/tab-text-selector";
import { ChatContext } from "@/context/chat/ChatContext";
interface TextPanelProps {
  setShowEspacio3: (show: boolean) => void;
}

export default function TextPanel({ setShowEspacio3 }: TextPanelProps) {
  const [activeTab, setActiveTab] = useState(0);
  const { scripts } = useContext(ChatContext);
  return (
    <div className="flex flex-col h-full border-t border-border bg-card text-foreground">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-medium">Panel Inferior Derecho</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowEspacio3(false)}
          aria-label="Ocultar Espacio 3"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col p-4">
        <div className="flex w-full">
          {scripts.map(
            (script: { type: string; text: string }, index: number) => (
              <TabTextSelector
                key={script.type}
                tabIndex={index}
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                tab={script}
              />
            )
          )}
        </div>
        <textarea
          className="w-full h-40 p-2 border border-border rounded-b-md rounded-t-none bg-muted text-foreground resize-none -mt-1"
          value={scripts[activeTab].text}
          readOnly
        />
      </div>
    </div>
  );
}
