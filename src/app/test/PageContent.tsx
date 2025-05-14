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
import Diagrama from "./components/Diagrama"; // Component for displaying diagrams
import { conversationMock } from "@/mocks/conversation"; // Mock data for conversation
import Chat from "./components/Chat"; // Component for chat interface

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
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-medium">
                      Panel Superior Derecho
                    </h2>
                    {!showEspacio1 && (
                      <Button
                        variant="ghost"
                        size="sm" // Cambiado a sm para que quepa mejor si hay más botones
                        onClick={() => setShowEspacio1(true)}
                        aria-label="Mostrar Espacio 1"
                      >
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Mostrar Panel Izquierdo
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
                    <Diagrama xmlString={xmlString} />
                  </div>
                </div>
              </ResizablePanel>

              {/* Espacio 3 Panel (equivalente a Schema Panel) */}
              {showEspacio3 && (
                <>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={30} minSize={20}>
                    <div className="flex flex-col h-full border-t">
                      <div className="p-4 border-b flex justify-between items-center">
                        <h2 className="text-lg font-medium">
                          Panel Inferior Derecho
                        </h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowEspacio3(false)}
                          aria-label="Ocultar Espacio 3"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
                        <h1>Espacio 3</h1>
                      </div>
                    </div>
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
