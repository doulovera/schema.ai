"use client";

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';

import { ChevronDown } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";

import Chat from "../sections/chat-panel";
import DiagramPanel from "../sections/diagram-panel";
import TextPanel from "../sections/text-panel";
import { useChatStore } from "@/stores/chat";

export default function PageContent() {
  const [panels, setPanels] = useState<{ [panel: string]: boolean }>({
    chat: true,
    schema: true,
  });

  const { loadChatThread, chatId: storeChatId, chatHistory } = useChatStore(); // Added chatHistory
  const params = useParams();
  const urlChatId = params.id as string;

  useEffect(() => {
    if (urlChatId) {
      // Only call loadChatThread if the urlChatId is different from the one in the store,
      // or if the chatHistory for the current urlChatId hasn't been loaded yet.
      // Access chatHistory via getState() to ensure the latest value is used inside useEffect
      if (urlChatId !== storeChatId || useChatStore.getState().chatHistory === null) {
        loadChatThread(urlChatId);
      }
    }
  }, [urlChatId, loadChatThread, storeChatId]); // storeChatId dependency ensures re-check if it changes

  const togglePanel = (panel: string) => {
    setPanels((prev) => ({
      ...prev,
      [panel]: !prev[panel],
    }));
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {panels.chat && (
            <>
              <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                <Chat hidePanel={() => togglePanel("chat")} />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          <ResizablePanel defaultSize={70}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={70} minSize={30}>
                <DiagramPanel
                  chatPanelIsShown={panels.chat}
                  toggleChatPanel={(show) =>
                    setPanels((prev) => ({ ...prev, chat: show }))
                  }
                />
              </ResizablePanel>

              {panels.schema && (
                <>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={30} minSize={20}>
                    <TextPanel hidePanel={() => togglePanel("schema")} />
                  </ResizablePanel>
                </>
              )}

              {!panels.schema && (
                <div className="border-t p-2 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePanel("schema")}
                    className="w-full"
                  >
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Schemas
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
