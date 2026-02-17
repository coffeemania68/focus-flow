import { useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { useTimer } from "@/contexts/TimerContext";

interface BlockTimerProps {
  durationMinutes: number;
  isActive: boolean;
  onComplete: () => void;
  onStart: () => void;
  blockId: string;
  blockTitle?: string;
  compact?: boolean;
}

export function BlockTimer({ durationMinutes, isActive, onComplete, onStart, blockId, blockTitle, compact }: BlockTimerProps) {
  const {
    remaining,
    isRunning,
    activeBlockId,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer
  } = useTimer();

  const isCurrentTimer = activeBlockId === blockId;
  const displaySeconds = isCurrentTimer ? remaining : durationMinutes * 60;

  const minutes = Math.floor(displaySeconds / 60);
  const seconds = displaySeconds % 60;

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Trigger onComplete when timer reaches 0
  useEffect(() => {
    if (isCurrentTimer && remaining === 0) {
      onCompleteRef.current();
    }
  }, [isCurrentTimer, remaining]);

  const toggle = () => {
    if (isCurrentTimer) {
      if (isRunning) pauseTimer();
      else resumeTimer();
    } else {
      onStart(); // Update active block in parent
      startTimer(blockId, durationMinutes, blockTitle);
    }
  };

  const reset = () => {
    if (isCurrentTimer) {
      resetTimer();
    }
  };

  const isUrgent = displaySeconds < 300 && displaySeconds > 0;
  const isDone = displaySeconds === 0 && isCurrentTimer; // Only consider done if it was the running timer

  const circumference = 2 * Math.PI * 45;
  const progress = 1 - displaySeconds / (durationMinutes * 60);
  const dashOffset = circumference * (1 - progress);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className={`font-mono text-sm font-bold ${isDone ? "text-success" : isUrgent ? "text-warning animate-pulse-glow" : "text-foreground"}`}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
        {!isDone && (
          <button
            onClick={toggle}
            className={`p-1 rounded transition-all ${isCurrentTimer && isRunning ? "text-warning" : "text-primary"
              }`}
          >
            {isCurrentTimer && isRunning ? <Pause size={12} /> : <Play size={12} />}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="hsl(var(--timer-track))"
            strokeWidth="4"
          />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={isDone ? "hsl(var(--success))" : isUrgent ? "hsl(var(--warning))" : "hsl(var(--primary))"}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono text-xl font-bold ${isDone ? "text-success" : isUrgent ? "text-warning animate-pulse-glow" : "text-foreground"}`}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-muted-foreground">{durationMinutes}분</span>
        </div>
      </div>
      <div className="flex gap-2">
        {!isDone ? (
          <>
            <button
              onClick={toggle}
              className={`p-2 rounded-lg transition-all ${isCurrentTimer && isRunning
                  ? "bg-warning/20 text-warning hover:bg-warning/30"
                  : "bg-primary/20 text-primary hover:bg-primary/30"
                }`}
            >
              {isCurrentTimer && isRunning ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              onClick={reset}
              className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-all"
            >
              <RotateCcw size={16} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-1 text-success text-sm font-medium">
            <CheckCircle2 size={16} />
            완료
          </div>
        )}
      </div>
    </div>
  );
}
