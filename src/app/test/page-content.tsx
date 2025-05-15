"use client";

// React and Next.js core imports
import { useState, useContext } from "react";
import { ChatContext } from "@/context/chat/ChatContext";
// UI components and icons
import { ChevronDown, ChevronUp } from "lucide-react"; // Icons for UI elements
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import Chat from "./sections/chat-panel";
import DiagramPanel from "./sections/diagram-panel";
import TextPanel from "./sections/text-panel";

export default function PageContent() {
  const [showEspacio1, setShowEspacio1] = useState(true);
  const [showEspacio3, setShowEspacio3] = useState(true);
  const { conversation } = useContext(ChatContext);
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Espacio 1 Panel (equivalente a Conversation Panel) */}
          {showEspacio1 && (
            <>
              <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                <Chat
                  setShowEspacio1={setShowEspacio1}
                  conversation={conversation}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {/* Paneles Principales (equivalente a Diagram and Schema Panels) */}
          <ResizablePanel defaultSize={70}>
            <ResizablePanelGroup direction="vertical">
              {/* Espacio 2 Panel (equivalente a Diagram Panel) */}
              <ResizablePanel defaultSize={70} minSize={30}>
                <DiagramPanel
                  showEspacio1={showEspacio1}
                  setShowEspacio1={setShowEspacio1}
                />
              </ResizablePanel>

              {/* Espacio 3 Panel (equivalente a Schema Panel) */}
              {showEspacio3 && (
                <>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={30} minSize={20}>
                    <TextPanel setShowEspacio3={setShowEspacio3} />
                  </ResizablePanel>
                </>
              )}

              {/* Botón para mostrar Espacio 3 (cuando está oculto) */}
              {!showEspacio3 && (
                <div className="border-t p-2 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEspacio3(true)}
                    className="w-full"
                  >
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Mostrar Panel Inferior Derecho
                  </Button>
                </div>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
