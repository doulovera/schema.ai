'use client'

import { useMemo, useCallback, memo } from 'react'
import type { IThread } from '@/models/Thread'
import { useChatStore } from '@/stores/chat'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { SchemaView } from '@/components/chat/schema-view'

interface SchemaPanelProps {
  thread: IThread | null
  isVisible: boolean
  onVisibilityChange: (visible: boolean) => void
}

// ✅ Memoizar el componente para evitar re-renders innecesarios
const SchemaPanel = memo(function SchemaPanel({
  thread,
  isVisible,
  onVisibilityChange,
}: SchemaPanelProps) {
  const { isLoading, chatSchemas } = useChatStore()

  // ✅ Memoización más eficiente con dependencias específicas
  const shouldAutoShow = useMemo(() => {
    const threadSql = thread?.schemas?.sql?.trim()
    const threadMongo = thread?.schemas?.mongo?.trim()
    const chatSql = chatSchemas?.sql?.trim()
    const chatMongo = chatSchemas?.mongo?.trim()

    return Boolean(threadSql || threadMongo || chatSql || chatMongo)
  }, [
    thread?.schemas?.sql,
    thread?.schemas?.mongo,
    chatSchemas?.sql,
    chatSchemas?.mongo,
  ])

  const hidePanel = useCallback(() => {
    onVisibilityChange(false)
  }, [onVisibilityChange])

  // ✅ Solo renderizar contenido si el panel es visible - con transición suave
  if (!isVisible) {
    return null
  }

  return (
    <div
      className="relative flex flex-col h-full border-t border-border bg-card text-foreground"
      style={{
        transition: 'none', // ✅ Evitar transiciones que puedan causar parpadeo
        willChange: 'auto', // ✅ Optimizar para animaciones
      }}
    >
      {isLoading && (
        <div className="absolute z-100 flex items-center justify-center h-full w-full bg-background opacity-50" />
      )}
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-medium">Schemas</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={hidePanel}
          aria-label="Ocultar Panel de Esquemas"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="relative flex flex-col p-4">
        <SchemaView schemas={chatSchemas} />
      </div>
    </div>
  )
})

export default SchemaPanel

// Hook personalizado para usar la lógica de visibilidad del panel de esquemas
export function useSchemaPanelVisibility(thread: IThread | null) {
  const { chatSchemas } = useChatStore()

  const shouldAutoShow = useMemo(() => {
    const threadSql = thread?.schemas?.sql?.trim()
    const threadMongo = thread?.schemas?.mongo?.trim()
    const chatSql = chatSchemas?.sql?.trim()
    const chatMongo = chatSchemas?.mongo?.trim()

    return Boolean(threadSql || threadMongo || chatSql || chatMongo)
  }, [
    thread?.schemas?.sql,
    thread?.schemas?.mongo,
    chatSchemas?.sql,
    chatSchemas?.mongo,
  ])

  return { shouldAutoShow }
}
