type Props = {
  setActiveTab: (tabIndex: number) => void
  activeTab: number
  tab: { type: string; text: string }
  tabIndex: number
}

export default function TabTextSelector({
  setActiveTab,
  activeTab,
  tab,
  tabIndex,
}: Props) {
  return (
    <button
      key={tab.type}
      onClick={() => setActiveTab(tabIndex)}
      className={`flex-1 py-2 px-4 text-sm font-medium border border-border border-b-0 transition-colors
                ${
                  activeTab === tabIndex
                    ? 'bg-muted text-foreground'
                    : 'bg-card text-muted-foreground hover:bg-muted/60'
                }
                `}
      type="button"
    >
      {tab.text}
    </button>
  )
}
