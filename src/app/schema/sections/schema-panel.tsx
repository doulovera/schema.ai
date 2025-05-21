'use client'

import { useChatStore } from '@/stores/chat'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { SchemaView } from '@/components/chat/schema-view'

export default function SchemaPanel({ hidePanel }: { hidePanel: () => void }) {
  const { isLoading, chatSchemas } = useChatStore()

  return (
    <div className="relative flex flex-col h-full border-t border-border bg-card text-foreground">
      {isLoading && (
        <div className="absolute z-100 flex items-center justify-center h-full w-full bg-background opacity-50" />
      )}
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-medium">Schemas</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={hidePanel}
          aria-label="Ocultar Espacio 3"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="relative flex flex-col p-4">
        <SchemaView schemas={chatSchemas} />
      </div>
    </div>
  )
}
