'use client';

import { useState } from "react";
import TabTextSelector from "@/components/chat/tab-text-selector";
import { useChatStore } from "@/stores/chat";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export default function SchemaPanel({ hidePanel }: { hidePanel: () => void }) {
  const { isLoading, chatSchemas } = useChatStore();
  const [activeTab, setActiveTab] = useState(0);
  const scripts = [
    { type: "sql", title: "SQL", text: chatSchemas.sql || "" },
    { type: "mongodb", title: "MongoDB", text: chatSchemas.mongo || "" },
  ];

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
        <div className="w-full h-40 p-2 border border-border rounded-b-md rounded-t-none bg-muted text-foreground -mt-1 overflow-auto">
          {
            isLoading
            ? <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
              </div>
            : <CodeBlock
                language={scripts[activeTab].type}
                script={scripts[activeTab].text}
              />
          }
        </div>
      </div>
    </div>
  );
}