import { CheckCircle2, Circle } from "lucide-react";

interface LongformCheckProps {
  completed: boolean;
  onToggle: () => void;
}

export function LongformCheck({ completed, onToggle }: LongformCheckProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all w-full ${
        completed
          ? "border-success/50 bg-success/10 glow-success"
          : "border-border bg-card hover:border-primary/30"
      }`}
    >
      {completed ? (
        <CheckCircle2 size={24} className="text-success shrink-0" />
      ) : (
        <Circle size={24} className="text-muted-foreground shrink-0" />
      )}
      <div className="text-left">
        <p className={`text-sm font-semibold ${completed ? "text-success" : "text-foreground"}`}>
          일일 1롱폼 완성
        </p>
        <p className="text-xs text-muted-foreground">
          {completed ? "오늘의 목표를 달성했습니다! 🎉" : "오늘 롱폼 1개를 완성하세요"}
        </p>
      </div>
    </button>
  );
}
