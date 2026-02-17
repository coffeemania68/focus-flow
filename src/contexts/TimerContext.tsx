import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { dispatchBlockNotification } from "@/components/BlockNotification";

interface TimerContextType {
    remaining: number;
    isRunning: boolean;
    activeBlockId: string | null;
    duration: number; // in seconds
    startTimer: (blockId: string, durationMinutes: number, title?: string) => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    toggleTimer: () => void;
    resetTimer: () => void;
    stopTimer: () => void; // Clears everything
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
    const [remaining, setRemaining] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    const [duration, setDuration] = useState(0);
    const [blockTitle, setBlockTitle] = useState("");

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const preAlertFiredRef = useRef(false);

    const clearTimerInterval = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const tick = useCallback(() => {
        setRemaining((prev) => {
            if (prev <= 1) {
                clearTimerInterval();
                setIsRunning(false);
                dispatchBlockNotification(blockTitle || "블록 완료", "start");
                return 0;
            }

            // Pre-alert check (5 mins)
            if (prev === 301 && !preAlertFiredRef.current) { // Check at 301 so next tick is 300
                if (localStorage.getItem("pre-alert") === "true") {
                    preAlertFiredRef.current = true;
                    dispatchBlockNotification(blockTitle || "다음 블록", "pre");
                }
            }
            return prev - 1;
        });
    }, [blockTitle, clearTimerInterval]);

    useEffect(() => {
        if (isRunning && remaining > 0) {
            clearTimerInterval();
            intervalRef.current = setInterval(tick, 1000);
        } else {
            clearTimerInterval();
        }
        return clearTimerInterval;
    }, [isRunning, remaining, tick, clearTimerInterval]);

    // If activeBlockId changes, we might want to logic here, but usually startTimer handles it.

    const startTimer = useCallback((blockId: string, durationMinutes: number, title?: string) => {
        // If switching blocks, reset
        if (blockId !== activeBlockId) {
            setActiveBlockId(blockId);
            setDuration(durationMinutes * 60);
            setRemaining(durationMinutes * 60);
            setBlockTitle(title || "");
            preAlertFiredRef.current = false;
            setIsRunning(true);
        } else {
            // Same block, just resume if not running? Or restart?
            // Usually startTimer implies "Set this as active and go"
            if (!isRunning) setIsRunning(true);
        }
    }, [activeBlockId, isRunning]);

    const pauseTimer = useCallback(() => setIsRunning(false), []);
    const resumeTimer = useCallback(() => setIsRunning(true), []);
    const toggleTimer = useCallback(() => setIsRunning(prev => !prev), []);

    const resetTimer = useCallback(() => {
        setIsRunning(false);
        setRemaining(duration);
        preAlertFiredRef.current = false;
    }, [duration]);

    const stopTimer = useCallback(() => {
        setIsRunning(false);
        setActiveBlockId(null);
        setRemaining(0);
        setDuration(0);
    }, []);

    return (
        <TimerContext.Provider value={{
            remaining,
            isRunning,
            activeBlockId,
            duration,
            startTimer,
            pauseTimer,
            resumeTimer,
            toggleTimer,
            resetTimer,
            stopTimer
        }}>
            {children}
        </TimerContext.Provider>
    );
}

export function useTimer() {
    const context = useContext(TimerContext);
    if (context === undefined) {
        throw new Error("useTimer must be used within a TimerProvider");
    }
    return context;
}
