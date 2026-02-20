import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { DayTemplate, getTodayTemplate } from "@/data/templates";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ScheduleSettings {
  /** 시작 시각 (HH:MM, e.g. "09:00") */
  startTime: string;
  /** 작업 블록 길이 (분) */
  workMin: number;
  /** 휴식 블록 길이 (분) */
  breakMin: number;
  /** 작업 회차 수 */
  periodCount: number;
}

export interface GeneratedPeriod {
  id: string;
  type: "work" | "break";
  label: string;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  durationMinutes: number;
}

interface DailyScheduleContextType {
  // ── Selected day template (replaces local state in Index.tsx) ──
  template: DayTemplate;
  setTemplate: (t: DayTemplate) => void;

  // ── Custom schedule settings ──
  settings: ScheduleSettings;
  updateSettings: (patch: Partial<ScheduleSettings>) => void;

  // ── Derived: generated time-block schedule from settings ──
  generatedSchedule: GeneratedPeriod[];

  // ── Block completion state ──
  activeBlock: number;
  setActiveBlock: (i: number) => void;
  completedBlocks: Set<string>;
  markBlockComplete: (blockId: string) => void;
  resetDayState: (t?: DayTemplate) => void;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: ScheduleSettings = {
  startTime: "09:00",
  workMin: 90,
  breakMin: 15,
  periodCount: 3,
};

const SETTINGS_KEY = "daily-schedule-settings";

function loadSettings(): ScheduleSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

// ─── Generator ───────────────────────────────────────────────────────────────

function generateSchedule(settings: ScheduleSettings): GeneratedPeriod[] {
  const { startTime, workMin, breakMin, periodCount } = settings;
  const [startH, startM] = startTime.split(":").map(Number);
  let cursor = startH * 60 + startM; // minutes from midnight

  const toHHMM = (mins: number) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const periods: GeneratedPeriod[] = [];
  for (let i = 0; i < periodCount; i++) {
    // Work block
    const workStart = cursor;
    const workEnd = cursor + workMin;
    periods.push({
      id: `gen-work-${i}`,
      type: "work",
      label: `작업 ${i + 1}`,
      startTime: toHHMM(workStart),
      endTime: toHHMM(workEnd),
      durationMinutes: workMin,
    });
    cursor = workEnd;

    // Break block (skip after last period)
    if (i < periodCount - 1) {
      const breakStart = cursor;
      const breakEnd = cursor + breakMin;
      periods.push({
        id: `gen-break-${i}`,
        type: "break",
        label: `휴식 ${i + 1}`,
        startTime: toHHMM(breakStart),
        endTime: toHHMM(breakEnd),
        durationMinutes: breakMin,
      });
      cursor = breakEnd;
    }
  }
  return periods;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const DailyScheduleContext = createContext<DailyScheduleContextType | undefined>(undefined);

export function DailyScheduleProvider({ children }: { children: ReactNode }) {
  const [template, setTemplateState] = useState<DayTemplate>(getTodayTemplate);
  const [settings, setSettings] = useState<ScheduleSettings>(loadSettings);
  const [activeBlock, setActiveBlock] = useState(0);
  const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set());

  const generatedSchedule = useMemo(() => generateSchedule(settings), [settings]);

  const setTemplate = useCallback((t: DayTemplate) => {
    setTemplateState(t);
  }, []);

  const updateSettings = useCallback((patch: Partial<ScheduleSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const markBlockComplete = useCallback((blockId: string) => {
    setCompletedBlocks((prev) => {
      const next = new Set(prev);
      next.add(blockId);
      return next;
    });
    setActiveBlock((prev) => prev + 1);
  }, []);

  const resetDayState = useCallback((t?: DayTemplate) => {
    if (t) setTemplateState(t);
    setActiveBlock(0);
    setCompletedBlocks(new Set());
  }, []);

  return (
    <DailyScheduleContext.Provider
      value={{
        template,
        setTemplate,
        settings,
        updateSettings,
        generatedSchedule,
        activeBlock,
        setActiveBlock,
        completedBlocks,
        markBlockComplete,
        resetDayState,
      }}
    >
      {children}
    </DailyScheduleContext.Provider>
  );
}

export function useDailySchedule() {
  const ctx = useContext(DailyScheduleContext);
  if (!ctx) throw new Error("useDailySchedule must be used within DailyScheduleProvider");
  return ctx;
}
