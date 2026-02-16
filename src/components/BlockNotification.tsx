import { useState, useEffect, useCallback } from "react";
import { Bell, X } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  time: string;
  type: "start" | "pre";
}

interface BlockNotificationProps {
  blocks: { id: string; title: string; durationMinutes: number }[];
  activeBlock: number;
  timerRunning?: boolean;
}

export function BlockNotification({ blocks, activeBlock }: BlockNotificationProps) {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [preAlertEnabled, setPreAlertEnabled] = useState(() => {
    return localStorage.getItem("pre-alert") === "true";
  });

  const togglePreAlert = useCallback(() => {
    const next = !preAlertEnabled;
    setPreAlertEnabled(next);
    localStorage.setItem("pre-alert", String(next));
  }, [preAlertEnabled]);

  // Listen for custom notification events from BlockTimer
  useEffect(() => {
    const handleNotify = (e: CustomEvent<Notification>) => {
      setNotification(e.detail);
    };

    window.addEventListener("block-notification" as any, handleNotify);
    return () => window.removeEventListener("block-notification" as any, handleNotify);
  }, []);

  const dismiss = () => setNotification(null);

  return (
    <>
      {/* Pre-alert toggle */}
      <button
        onClick={togglePreAlert}
        className={`p-2 rounded-lg border transition-all ${
          preAlertEnabled
            ? "bg-warning/10 border-warning/30 text-warning"
            : "bg-card border-border text-muted-foreground hover:text-foreground"
        }`}
        title={preAlertEnabled ? "5분 전 알림 ON" : "5분 전 알림 OFF"}
      >
        <Bell size={16} />
      </button>

      {/* Popup notification */}
      {notification && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/70 backdrop-blur-sm animate-slide-up">
          <div className="bg-card border border-primary/40 rounded-2xl p-8 max-w-sm mx-4 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Bell size={24} className="text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {notification.type === "pre" ? "5분 후 시작" : "지금 시작"}
              </p>
              <h2 className="text-lg font-bold text-foreground">{notification.title}</h2>
              <p className="text-sm text-muted-foreground">{notification.time}</p>
            </div>
            <button
              onClick={dismiss}
              className="px-8 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Helper to dispatch notification events
export function dispatchBlockNotification(title: string, type: "start" | "pre") {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  window.dispatchEvent(
    new CustomEvent("block-notification", {
      detail: { id: Date.now().toString(), title, time, type },
    })
  );
}
