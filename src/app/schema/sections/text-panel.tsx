"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import TabTextSelector from "@/components/chat/tab-text-selector";
import { useChatStore } from "@/stores/chat";
import { generateDatabaseScriptFromDiagram } from "@/lib/gemini";

export default function TextPanel({ hidePanel }: { hidePanel: () => void }) {
  const { chatSchemas, isLoading } = useChatStore();

  console.log(chatSchemas);

  const [scripts, setScripts] = useState([
    { type: "SQL", text: chatSchemas.sql || "" },
    { type: "MongoDB", text: chatSchemas.mongo || "" },
  ]);

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col h-full border-t border-border bg-card text-foreground">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-medium">Schemas</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => hidePanel()}
          aria-label="Ocultar Espacio 3"
        >
          <ChevronUp className="h-4 w-4" />
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
          value={isLoading ? "Generando script..." : scripts[activeTab]?.text}
          readOnly
        />
      </div>
    </div>
  );
}
