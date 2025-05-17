import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Diagrama from "@/components/reactflow/xml-diagram";

export default function DiagramPanel({
  chatPanelIsShown,
  toggleChatPanel,
}: {
  chatPanelIsShown: boolean;
  toggleChatPanel: (show: boolean) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">Diagrama</h2>
        {!chatPanelIsShown && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleChatPanel(true)}
            aria-label="Mostrar Espacio 1"
          >
            <ChevronDown className="h-4 w-4 mr-2" />
            Mostrar Panel Izquierdo
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        <Diagrama />
      </div>
    </div>
  );
}
