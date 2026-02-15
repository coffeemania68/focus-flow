import { templates, DayTemplate } from "@/data/templates";

interface DaySelectorProps {
  selected: DayTemplate;
  onSelect: (template: DayTemplate) => void;
}

const DAY_SHORT: Record<string, string> = {
  monday: "월",
  tuesday: "화",
  wednesday: "수",
  thursday: "목",
  friday: "금",
  saturday: "토",
  sunday: "일",
};

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
              : t.isRestDay
              ? "bg-secondary/50 text-muted-foreground/50 hover:text-muted-foreground hover:bg-secondary"
              : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          {DAY_SHORT[t.day] || t.dayKo.slice(0, 1)}
        </button>
      ))}
    </div>
  );
}
