import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Diagram } from "@/components/reactflow/diagram";
import {
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default function DiagramPanel({
  chatPanelIsShown,
  toggleChatPanel,
}: {
  chatPanelIsShown: boolean;
  toggleChatPanel: (show: boolean) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b flex justify-between items-center">
        <div className="flex items-center gap-6">
          {!chatPanelIsShown && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleChatPanel(true)}
              aria-label="Mostrar Espacio 1"
              className="bg-neutral-100 dark:bg-neutral-900"
            >
              <ChevronRight className="h-4 w-4 mr-2" />
              Mostrar Chat
            </Button>
          )}
          <h2 className="text-lg font-medium">Diagrama</h2>
        </div>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        <Diagram />
      </div>
    </div>
  );
}
