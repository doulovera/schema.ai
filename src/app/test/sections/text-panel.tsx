import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import TabTextSelector from "@/components/chat/tab-text-selector";
interface TextPanelProps {
  setShowEspacio3: (show: boolean) => void;
}

const tabs = [
  { type: "SQL", text: "hola mundo from sql" },
  { type: "MongoDB", text: "hola mundo from mongo db" },
];

export default function TextPanel({ setShowEspacio3 }: TextPanelProps) {
  const [activeTab, setActiveTab] = useState(0);

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
          {tabs.map((tab, index) => (
            <TabTextSelector
              key={tab.type}
              tabIndex={index}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              tab={tab}
            />
          ))}
        </div>
        <textarea
          className="w-full h-40 p-2 border border-border rounded-b-md rounded-t-none bg-muted text-foreground resize-none -mt-1"
          value={tabs[activeTab].text}
          readOnly
        />
      </div>
    </div>
  );
}
