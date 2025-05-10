"use client"
import { useState } from "react"
import { ChevronDown, ChevronUp, Download, Trash2 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { DiagramView } from "@/components/chat/diagram-view"
import { SchemaView } from "@/components/chat/schema-view"
import { ChatInput } from "@/components/chat/chat-input"
import { ConversationView } from "@/components/chat/conversation-view"

export default function SchemaPage({ params }: { params: { slug: string } }) {
  const [showConversation, setShowConversation] = useState(true)
  const [showSchemas, setShowSchemas] = useState(true)

  return (
    <div className="flex flex-col h-screen">

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Conversation Panel */}
          {showConversation && (
            <>
              <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-medium">conversacion</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowConversation(false)}
                      aria-label="Hide conversation"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-auto p-4">
                    <ConversationView />
                  </div>
                  <div className="p-4 border-t">
                    <ChatInput />
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {/* Diagram and Schema Panels */}
          <ResizablePanel defaultSize={70}>
            <ResizablePanelGroup direction="vertical">
              {/* Diagram Panel */}
              <ResizablePanel defaultSize={70}>
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-medium">diagramas</h2>
                    <div className="flex gap-2">
                      {!showConversation && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowConversation(true)}
                          aria-label="Show conversation"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto p-4">
                    <DiagramView />
                  </div>
                </div>
              </ResizablePanel>

              {/* Schema Panel */}
              {showSchemas && (
                <>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={30}>
                    <div className="flex flex-col h-full">
                      <div className="p-4 border-b flex justify-between items-center">
                        <h2 className="text-lg font-medium">schemas</h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowSchemas(false)}
                          aria-label="Hide schemas"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex-1 overflow-auto p-4">
                        <SchemaView />
                      </div>
                    </div>
                  </ResizablePanel>
                </>
              )}

              {/* Show Schemas Button (when hidden) */}
              {!showSchemas && (
                <div className="border-t p-2 flex justify-center">
                  <Button variant="ghost" size="sm" onClick={() => setShowSchemas(true)} className="w-full">
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Show Schemas
                  </Button>
                </div>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
