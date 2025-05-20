"use client";

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';

import { ChevronUp } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";

import Chat from "../sections/chat-panel";
import DiagramPanel from "../sections/diagram-panel";
import SchemaPanel from "../sections/schema-panel";
import { useChatStore } from "@/stores/chat";
import { useConfigStore } from "@/stores/config";
import { useUser } from "@clerk/nextjs";

export default function PageContent() {
  const [panels, setPanels] = useState<{ [panel: string]: boolean }>({
    chat: true,
    schema: true,
  });

  const { loadChatThread, chatId: storeChatId } = useChatStore();
  const params = useParams();
  const urlChatId = params.id as string;

  const { user } = useUser();
  const userId = user?.id
  const { setUserId } = useConfigStore();
  
  useEffect(() => {
    if (userId) setUserId(userId);
  }, [userId, setUserId]);

  useEffect(() => {
    if (urlChatId) {
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
                    <SchemaPanel hidePanel={() => togglePanel("schema")} />
                  </ResizablePanel>
                </>
              )}

              {!panels.schema && (
                <div className="border-t p-2 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePanel("schema")}
                    aria-label="Mostrar Espacio 1"
                    className="w-full bg-neutral-100 dark:bg-neutral-900"
                  >
                    <ChevronUp className="h-4 w-4 mr-2" />
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
