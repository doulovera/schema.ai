'use client'

import {
  useMemo,
  useCallback,
  memo,
  useState,
  useEffect,
  Suspense,
} from 'react'
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

// ✅ Componente de carga ligero
const SchemaViewFallback = () => (
  <div className="h-full flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">
      Cargando schemas...
    </div>
  </div>
)

// ✅ Memoizar el componente para evitar re-renders innecesarios
const SchemaPanel = memo(function SchemaPanel({
  thread,
  isVisible,
  onVisibilityChange,
}: SchemaPanelProps) {
  const { isLoading, chatSchemas } = useChatStore()
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  // ✅ Marcar que el panel ha sido visible al menos una vez
  useEffect(() => {
    if (isVisible && !hasBeenVisible) {
      setHasBeenVisible(true)
    }
  }, [isVisible, hasBeenVisible])

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

  // ✅ No renderizar nada si nunca ha sido visible
    return null
  }

  return (
    <div
      className="relative flex flex-col h-full border-t border-border bg-card text-foreground"
      style={{
        display: isVisible ? 'flex' : 'none', // ✅ Ocultar con CSS si ya ha sido renderizado
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
        {/* ✅ Solo renderizar SchemaView cuando es visible con Suspense */}
        {isVisible ? (
          <Suspense fallback={<SchemaViewFallback />}>
            <SchemaView schemas={chatSchemas} />
          </Suspense>
        ) : (
          // ✅ Placeholder ligero para mantener el DOM pero sin contenido pesado
          <div className="h-full" />
        )}
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
