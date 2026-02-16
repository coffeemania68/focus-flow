import { useViewMode, ViewMode } from "@/contexts/ViewModeContext";
import { Minimize2, Monitor, Maximize2 } from "lucide-react";

const modes: { key: ViewMode; icon: typeof Minimize2; label: string }[] = [
  { key: "small", icon: Minimize2, label: "미니" },
  { key: "medium", icon: Monitor, label: "기본" },
  { key: "large", icon: Maximize2, label: "확장" },
];

export function ViewModeToggle() {
  const { mode, setMode } = useViewMode();

  return (
    <div className="flex items-center bg-secondary rounded-lg p-0.5 gap-0.5">
      {modes.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => setMode(key)}
          className={`p-1.5 rounded-md transition-all text-xs flex items-center gap-1 ${
            mode === key
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={label}
        >
          <Icon size={12} />
        </button>
      ))}
    </div>
  );
}
