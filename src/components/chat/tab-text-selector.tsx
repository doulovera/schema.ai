export default function TabTextSelector({setActiveTab, activeTab, tab, tabIndex}) {
  return (
    <button
      key={tab.type}
      onClick={() => setActiveTab(tabIndex)}
      className={`flex-1 py-2 px-4 text-sm font-medium border border-border border-b-0 transition-colors
                ${
                  activeTab === tabIndex
                    ? "bg-muted text-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted/60"
                }
                `}
      style={{
        // Eliminar el borde inferior cuando está activa para fusionarse con el textarea
        borderBottomColor: activeTab === tab ? "transparent" : undefined,
        zIndex: activeTab === tab ? 10 : 1,
      }}
      type="button"
    >
      {tab.type}
    </button>
  );
}
