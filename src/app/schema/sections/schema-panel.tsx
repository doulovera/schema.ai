import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import TabTextSelector from "@/components/chat/tab-text-selector";

export default function SchemaPanel({ hidePanel }: {  hidePanel: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const scripts = [{ type: "SQL", text: "hola mundo from sql" }, { type: "MongoDB", text: "hola mundo from mongo db" }];
  return (
    <div className="flex flex-col h-full border-t border-border bg-card text-foreground">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-medium">Schemas</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={hidePanel}
          aria-label="Ocultar Espacio 3"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col p-4">
        <div className="flex w-full">
          {scripts?.map(
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
          value={scripts[activeTab]?.text}
          readOnly
        />
      </div>
    </div>
  );
}
