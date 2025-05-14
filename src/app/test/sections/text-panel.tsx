import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react"; // Assuming lucide-react for icons

interface TextPanelProps {
    setShowEspacio3: (show: boolean) => void;
}

export default function TextPanel({ setShowEspacio3 }: TextPanelProps) {
    return (
        <div className="flex flex-col h-full border-t">
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-medium">Panel Inferior Derecho</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowEspacio3(false)}
                    aria-label="Ocultar Espacio 3"
                >
                    <ChevronUp className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
                <h1>Espacio 3</h1>
            </div>
        </div>
    );
}
