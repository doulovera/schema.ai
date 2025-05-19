import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import TabTextSelector from "@/components/chat/tab-text-selector";
import { useChatStore } from "@/stores/chat";
import Prism from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-mongodb"; // Asegúrate que este es el que quieres para MongoDB
import "prismjs/themes/prism-okaidia.css"; // Puedes elegir el tema que prefieras
import "prismjs/plugins/toolbar/prism-toolbar.js";
import "prismjs/plugins/toolbar/prism-toolbar.css";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js";

export default function SchemaPanel({ hidePanel }: { hidePanel: () => void }) {
  const { isLoading, chatSchemas } = useChatStore();
  const [activeTab, setActiveTab] = useState(0);
  const scripts = [
    { type: "sql", title: "SQL", text: chatSchemas.sql || "" },
    { type: "mongodb", title: "MongoDB", text: chatSchemas.mongo || "" }, // Para Prism, el 'type' debe coincidir con el lenguaje registrado
  ];

  useEffect(() => {
    Prism.highlightAll();
  }, [activeTab, scripts, isLoading]);

  return (
    <div className="flex flex-col h-full border-t border-border bg-card text-foreground">
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
          <pre className="whitespace-pre-wrap toolbar w-full !opacity-100">
            <code
              className={`language-${scripts[activeTab]?.type.toLowerCase()}`}
            >
              {isLoading ? "Generando script" : scripts[activeTab]?.text}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}