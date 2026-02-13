import { templates, DayTemplate } from "@/data/templates";

interface DaySelectorProps {
  selected: DayTemplate;
  onSelect: (template: DayTemplate) => void;
}

export function DaySelector({ selected, onSelect }: DaySelectorProps) {
  return (
    <div className="flex gap-1.5">
      {templates.map((t) => (
        <button
          key={t.day}
          onClick={() => onSelect(t)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selected.day === t.day
              ? "bg-primary text-primary-foreground glow-primary"
              : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          {t.dayKo.slice(0, 1)}
        </button>
      ))}
    </div>
  );
}
