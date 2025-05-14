"use client";

// React and Next.js core imports
import { useState } from "react";
// UI components and icons
import { ChevronDown, ChevronUp } from "lucide-react"; // Icons for UI elements
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"; // Components for creating resizable layouts
import { Button } from "@/components/ui/button"; // Button component
// Local components and mocks
import Diagrama from "../../components/reactflow/xml-diagram"; // Component for displaying diagrams
import { conversationMock } from "@/mocks/conversation"; // Mock data for conversation
import Chat from "./sections/chat-panel"; // Component for chat interface
import DiagramPanel from "./sections/diagram-panel";
import TextPanel from "./sections/text-panel";

export default function PageContent({ xmlString }) {
  const [showEspacio1, setShowEspacio1] = useState(true);
  const [showEspacio3, setShowEspacio3] = useState(true);
  const conversation = conversationMock
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Espacio 1 Panel (equivalente a Conversation Panel) */}
          {showEspacio1 && (
            <>
              <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                <Chat setShowEspacio1={setShowEspacio1} conversation={conversation} />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {/* Paneles Principales (equivalente a Diagram and Schema Panels) */}
          <ResizablePanel defaultSize={70}>
            <ResizablePanelGroup direction="vertical">
              {/* Espacio 2 Panel (equivalente a Diagram Panel) */}
              <ResizablePanel defaultSize={70} minSize={30}>
                <DiagramPanel xmlString={xmlString} showEspacio1={showEspacio1} setShowEspacio1={setShowEspacio1} />
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
