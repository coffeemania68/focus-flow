import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";

interface BlockTimerProps {
  durationMinutes: number;
  isActive: boolean;
  onComplete: () => void;
  onStart: () => void;
  blockId: string;
}

export function BlockTimer({ durationMinutes, isActive, onComplete, onStart, blockId }: BlockTimerProps) {
  const totalSeconds = durationMinutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const progress = 1 - remaining / totalSeconds;
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference * (1 - progress);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  useEffect(() => {
    setRemaining(totalSeconds);
    setRunning(false);
  }, [blockId, totalSeconds]);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setRunning(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remaining, onComplete]);

  const toggle = useCallback(() => {
    if (!running && !isActive) {
      onStart();
    }
    setRunning((prev) => !prev);
  }, [running, isActive, onStart]);

  const reset = useCallback(() => {
    setRunning(false);
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  const isUrgent = remaining < 300 && remaining > 0;
  const isDone = remaining === 0;

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
              className={`p-2 rounded-lg transition-all ${
                running
                  ? "bg-warning/20 text-warning hover:bg-warning/30"
                  : "bg-primary/20 text-primary hover:bg-primary/30"
              }`}
            >
              {running ? <Pause size={16} /> : <Play size={16} />}
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
