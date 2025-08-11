interface NavigationProps {
  activeView: "dashboard" | "analytics" | "calendar" | "database";
  onViewChange: (
    view: "dashboard" | "analytics" | "calendar" | "database"
  ) => void;
}

export default function Navigation({
  activeView,
  onViewChange,
}: NavigationProps) {
  const navItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: "🏠" },
    { id: "calendar" as const, label: "Calendar", icon: "📅" },
    { id: "analytics" as const, label: "Analytics", icon: "📊" },
    { id: "database" as const, label: "Database", icon: "🔗" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeView === item.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
