'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PATHS } from '@/constants/paths'
import { duplicateThread } from '@/lib/thread'
import { useRouter } from 'next/navigation'

export function ExampleButtons({ userId }: { userId: string }) {
  const router = useRouter()
  const [loadingChatId, setLoadingChatId] = useState<string | null>(null)

  const examples = [
    {
      chatId: 'example-online-clothing-store',
      title: '👗 Tienda de Ropa Online',
    },
    {
      chatId: 'example-cat-manager',
      title: '😽 Gestor de gatos',
    },
    {
      chatId: 'example-hackathon_project_management',
      title: '🛠️ Gestor de Proyectos de Hackathon',
    },
  ]

  const handleDuplicate = async (chatId: string) => {
    setLoadingChatId(chatId)
    try {
      const response = await duplicateThread(chatId, userId)
      if (response?.chat_id) {
        router.push(`${PATHS.CHAT}/${response.chat_id}`)
      } else {
        console.error('Error duplicating thread or chat_id missing in response')
      }
    } catch (error) {
      console.error('Error in handleDuplicate:', error)
    } finally {
      setLoadingChatId(null)
    }
  }

  return (
    <div className="pt-4 text-center">
      <div className="border-t-[1px] border-t-muted-foreground/50 w-80 mx-auto pt-4 text-center" />
      <p className="text-sm text-muted-foreground mb-4">
        O prueba uno de estos ejemplos:
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        {examples.map((example) => (
          <Button
            key={example.chatId}
            variant="outline"
            className="border-dotted"
            onClick={() => handleDuplicate(example.chatId)}
            disabled={loadingChatId !== null} // Disable all buttons if any is loading
          >
            {loadingChatId === example.chatId ? 'Cargando...' : example.title}
          </Button>
        ))}
      </div>
    </div>
  )
}
