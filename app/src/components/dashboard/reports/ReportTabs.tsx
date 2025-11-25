interface Tab {
  id: "overview" | "productivity" | "pipeline" | "deadlines";
  name: string;
  icon: string;
}

interface ReportTabsProps {
  activeTab: "overview" | "productivity" | "pipeline" | "deadlines";
  onTabChange: (tab: "overview" | "productivity" | "pipeline" | "deadlines") => void;
}

export function ReportTabs({ activeTab, onTabChange }: ReportTabsProps) {
  const tabs: Tab[] = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "productivity", name: "Productivity", icon: "⚡" },
    { id: "pipeline", name: "Pipeline", icon: "🔄" },
    { id: "deadlines", name: "Deadlines", icon: "📅" },
  ];

  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
}
