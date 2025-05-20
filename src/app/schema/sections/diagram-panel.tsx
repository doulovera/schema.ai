import { ChevronRight, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Diagram } from '@/components/reactflow/diagram'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { useEffect } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { useChatStore } from '@/stores/chat'
import { useConfigStore } from '@/stores/config'
import { PATHS } from '@/constants/paths'
import Link from 'next/link'

export default function DiagramPanel({
  chatPanelIsShown,
  toggleChatPanel,
}: {
  chatPanelIsShown: boolean
  toggleChatPanel: (show: boolean) => void
}) {
  const { isDarkMode, setDarkMode } = useConfigStore()
  const { isLoading } = useChatStore()

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setDarkMode(!isDarkMode)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-6">
          {!chatPanelIsShown && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleChatPanel(true)}
              aria-label="Mostrar Espacio 1"
              className="bg-card text-foreground"
            >
              <ChevronRight className="h-4 w-4 mr-2" />
              Mostrar Chat
            </Button>
          )}
          <h2 className="text-lg font-medium">Diagrama</h2>
        </div>
        <div className="flex items-center gap-4">
          <Link href={PATHS.SCHEMAS} className="text-sm text-muted-foreground">
            <p className="text-foreground">Ver Esquemas</p>
          </Link>

          <SignedIn>
            <UserButton />
          </SignedIn>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      <div className="relative flex-1 overflow-auto p-4 flex items-center justify-center">
        {isLoading && (
          <div className="absolute z-100 flex items-center justify-center h-full w-full bg-black opacity-50" />
        )}
        <ReactFlowProvider>
          <Diagram />
        </ReactFlowProvider>
      </div>
    </div>
  )
}
