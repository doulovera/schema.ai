import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Diagrama from "@/components/reactflow/xml-diagram";
interface DiagramPanelProps {
  showEspacio1: boolean;
  setShowEspacio1: (show: boolean) => void;
}

export default function DiagramPanel({
  showEspacio1,
  setShowEspacio1,
}: DiagramPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">Panel Superior Derecho</h2>
        {!showEspacio1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEspacio1(true)}
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
