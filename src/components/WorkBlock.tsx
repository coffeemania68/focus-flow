import { useState } from "react";
import { BlockTask, TOOLS_CONFIG } from "@/data/templates";
import { BlockTimer } from "./BlockTimer";
import { AlertTriangle, Check, ChevronDown, ChevronUp } from "lucide-react";

interface WorkBlockProps {
  block: BlockTask;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  onActivate: () => void;
  onComplete: () => void;
  onTimerEnd: () => void;
}

export function WorkBlock({ block, index, isActive, isCompleted, onActivate, onComplete, onTimerEnd }: WorkBlockProps) {
  const [expanded, setExpanded] = useState(isActive);
  const [checked, setChecked] = useState(false);

  const handleTimerComplete = () => {
    onTimerEnd();
    setChecked(false);
  };

  const handleCheck = () => {
    setChecked(true);
    setTimeout(() => onComplete(), 500);
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-300 ${
        isCompleted
          ? "border-success/30 bg-success/5"
          : isActive
          ? "border-primary/50 bg-card glow-primary"
          : "border-border bg-card/50 opacity-60"
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-bold ${
              isCompleted
                ? "bg-success/20 text-success"
                : isActive
                ? "bg-primary/20 text-primary"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {isCompleted ? <Check size={16} /> : index + 1}
          </div>
          <div>
            <h3 className={`font-semibold text-sm ${isCompleted ? "text-success" : isActive ? "text-foreground" : "text-muted-foreground"}`}>
              {block.title}
            </h3>
            <p className="text-xs text-muted-foreground">{block.durationMinutes}분</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {block.tools && block.tools.length > 0 && (
            <div className="flex gap-1">
              {block.tools.map((tool) => (
                <span key={tool} className="text-xs" title={TOOLS_CONFIG[tool].label}>
                  {TOOLS_CONFIG[tool].icon}
                </span>
              ))}
            </div>
          )}
          {expanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 animate-slide-up">
          <p className="text-sm text-secondary-foreground">{block.description}</p>

          {/* Rules */}
          <div className="space-y-1.5">
            {block.rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <AlertTriangle size={12} className="text-warning mt-0.5 shrink-0" />
                <span className="text-warning/80">{rule}</span>
              </div>
            ))}
          </div>

          {/* Tools */}
          {block.tools && block.tools.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {block.tools.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-xs text-secondary-foreground"
                >
                  {TOOLS_CONFIG[tool].icon} {TOOLS_CONFIG[tool].label} ({TOOLS_CONFIG[tool].count})
                </span>
              ))}
            </div>
          )}

          {/* Timer + Complete */}
          <div className="flex items-center justify-between">
            <BlockTimer
              durationMinutes={block.durationMinutes}
              isActive={isActive}
              onComplete={handleTimerComplete}
              onStart={onActivate}
              blockId={block.id}
            />

            {isActive && !isCompleted && (
              <button
                onClick={handleCheck}
                disabled={checked}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  checked
                    ? "bg-success/20 text-success"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                <Check size={16} />
                {checked ? "완료!" : "블록 완료 체크"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
