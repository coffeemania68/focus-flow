import { useState } from "react";
import { StickyNote, X, Minimize2, Maximize2 } from "lucide-react";

export function FloatingNote() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem("schedule-notes") || "";
  });

  const saveNotes = (value: string) => {
    setNotes(value);
    localStorage.setItem("schedule-notes", value);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-all glow-primary"
        title="노트 열기"
      >
        <StickyNote size={20} />
      </button>
    );
  }

  return (
    <div
      className={`fixed z-40 bg-card border border-border rounded-2xl shadow-2xl transition-all ${
        minimized
          ? "bottom-6 right-6 w-48 h-12"
          : "bottom-6 right-6 w-80 h-96"
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <StickyNote size={14} className="text-primary" />
          <span className="text-xs font-semibold text-foreground">📓 노트</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
          >
            {minimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
          >
            <X size={12} />
          </button>
        </div>
      </div>
      {!minimized && (
        <textarea
          value={notes}
          onChange={(e) => saveNotes(e.target.value)}
          placeholder="아이디어, 메모, 체크리스트..."
          className="w-full h-[calc(100%-2.5rem)] p-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none"
        />
      )}
    </div>
  );
}
