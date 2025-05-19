"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import TabTextSelector from "@/components/chat/tab-text-selector";
import { useChatStore } from "@/stores/chat";
import { generateDatabaseScriptFromDiagram } from "@/lib/gemini";

export default function TextPanel({ hidePanel }: { hidePanel: () => void }) {
  const { chatDiagram } = useChatStore();

  const [scripts, setScripts] = useState([
    { type: "SQL", text: "" },
    { type: "MongoDB", text: "" },
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generateScripts = async () => {
      setLoading(true);
      try {
        const [sqlScript, mongoScript] = await Promise.all([
          generateDatabaseScriptFromDiagram(chatDiagram || "", "sql"),
          generateDatabaseScriptFromDiagram(chatDiagram || "", "mongo"),
        ]);
        setScripts([
          { type: "SQL", text: sqlScript },
          { type: "MongoDB", text: mongoScript },
        ]);
      } catch (e) {
        setScripts([
          { type: "SQL", text: "Error generando script SQL" },
          { type: "MongoDB", text: "Error generando script MongoDB" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (chatDiagram) {
      generateScripts();
    } else {
      setScripts([
        { type: "SQL", text: "" },
        { type: "MongoDB", text: "" },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatDiagram]);

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
          value={loading ? "Generando script..." : scripts[activeTab]?.text}
          readOnly
        />
      </div>
    </div>
  );
}
