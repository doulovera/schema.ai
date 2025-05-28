'use client'

import type { IThread } from '@/models/Thread'
import type { ThreadWithConversation } from '@/types/thread'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useParams } from 'next/navigation'

import { ChevronUp } from 'lucide-react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Button } from '@/components/ui/button'

import Chat from '../sections/chat-panel'
import DiagramPanel from '../sections/diagram-panel'
import SchemaPanel, { useSchemaPanelVisibility } from '../sections/schema-panel'
import { useChatStore } from '@/stores/chat'
import { useConfigStore } from '@/stores/config'
import { useUser } from '@clerk/nextjs'

export default function PageContent({ thread }: { thread: ThreadWithConversation | null }) {
  const { loadChatThread, chatId: storeChatId } = useChatStore()
  const params = useParams()
  const urlChatId = params.id as string

  const { user } = useUser()
  const userId = user?.id
  const { setUserId } = useConfigStore()

  // Usar el hook del panel de esquemas para la lógica de auto-mostrar
  const { shouldAutoShow: shouldShowSchemaPanel } =
    useSchemaPanelVisibility(thread)

  // Estado para paneles que pueden ser toggled manualmente
  const [manualPanelOverrides, setManualPanelOverrides] = useState<{
    [panel: string]: boolean | undefined
  }>({})

  // Estado derivado: combina lógica automática con overrides manuales
  const panels = useMemo(
    () => ({
      chat: manualPanelOverrides.chat ?? true,
      schema: manualPanelOverrides.schema ?? shouldShowSchemaPanel,
    }),
    [
      manualPanelOverrides.chat,
      manualPanelOverrides.schema,
      shouldShowSchemaPanel,
    ],
  )

  useEffect(() => {
    if (userId) setUserId(userId)
  }, [userId, setUserId])

  // biome-ignore lint/correctness/useExhaustiveDependencies: no need
  useEffect(() => {
    if (urlChatId) {
      if (
        urlChatId !== storeChatId ||
        useChatStore.getState().chatHistory === null
      ) {
        loadChatThread(urlChatId, thread)
      }
    }
  }, [urlChatId, loadChatThread, storeChatId])

  const togglePanel = useCallback(
    (panel: keyof typeof panels) => {
      setManualPanelOverrides((prev) => ({
        ...prev,
        [panel]: !panels[panel],
      }))
    },
    [panels],
  )

  const toggleChatPanel = useCallback((show: boolean) => {
    setManualPanelOverrides((prev) => ({ ...prev, chat: show }))
  }, [])

  const hideChatPanel = useCallback(() => {
    togglePanel('chat')
  }, [togglePanel])

  const onSchemaVisibilityChange = useCallback((visible: boolean) => {
    setManualPanelOverrides((prev) => ({
      ...prev,
      schema: visible,
    }))
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup
          direction="horizontal"
          style={{ transition: 'none' }} // ✅ Deshabilitar transiciones para evitar parpadeo
        >
          {panels.chat && (
            <>
              <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                <Chat hidePanel={hideChatPanel} />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          <ResizablePanel defaultSize={70}>
            <ResizablePanelGroup
              direction="vertical"
              style={{ transition: 'none' }} // ✅ Deshabilitar transiciones para evitar parpadeo
            >
              <ResizablePanel defaultSize={70} minSize={30}>
                <DiagramPanel
                  chatPanelIsShown={panels.chat}
                  toggleChatPanel={toggleChatPanel}
                />
              </ResizablePanel>

              {panels.schema && (
                <>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={30} minSize={20}>
                    <SchemaPanel
                      thread={thread}
                      isVisible={panels.schema}
                      onVisibilityChange={onSchemaVisibilityChange}
                    />
                  </ResizablePanel>
                </>
              )}

              {!panels.schema && (
                <div className="border-t p-2 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePanel('schema')}
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
  )
}
