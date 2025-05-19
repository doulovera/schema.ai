import { ChevronRight, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Diagram } from "@/components/reactflow/diagram";
import {
  SignedIn,
  UserButton,
} from '@clerk/nextjs'
import { useState, useEffect } from "react";

export default function DiagramPanel({
  chatPanelIsShown,
  toggleChatPanel,
}: {
  chatPanelIsShown: boolean;
  toggleChatPanel: (show: boolean) => void;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial theme from body class
    setIsDarkMode(document.body.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    document.body.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  };

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
          <SignedIn>
            <UserButton />
          </SignedIn>

          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        <Diagram />
      </div>
    </div>
  );
}
