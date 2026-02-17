import { useState, useEffect, useRef, useCallback } from "react";
import { X, Brain } from "lucide-react";

interface PadData {
  quickDump: string;
  parkingLot: string;
  clipboard: string;
}

interface PadHeights {
  quickDump: number;
  parkingLot: number;
  clipboard: number;
}

const STORAGE_KEY = "brain-panel-notes";
const WIDTH_KEY = "brain-panel-width";
const HEIGHTS_KEY = "brain-panel-heights";
const MIN_WIDTH = 280;
const DEFAULT_WIDTH_PERCENT = 35;

const pads = [
  { key: "quickDump" as const, label: "⚡ Quick Dump", color: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800/40" },
  { key: "parkingLot" as const, label: "🅿️ Parking Lot", color: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/40" },
  { key: "clipboard" as const, label: "📋 Clipboard Pad", color: "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800/40" },
] as const;

export const BrainPanel = () => {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<PadData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { quickDump: "", parkingLot: "", clipboard: "" };
    } catch { return { quickDump: "", parkingLot: "", clipboard: "" }; }
  });
  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem(WIDTH_KEY);
    return saved ? Number(saved) : Math.max(MIN_WIDTH, window.innerWidth * DEFAULT_WIDTH_PERCENT / 100);
  });
  const [heights, setHeights] = useState<PadHeights>(() => {
    try {
      const saved = localStorage.getItem(HEIGHTS_KEY);
      return saved ? JSON.parse(saved) : { quickDump: 150, parkingLot: 150, clipboard: 150 };
    } catch { return { quickDump: 150, parkingLot: 150, clipboard: 150 }; }
  });

  const dragging = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Save notes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  // Save width
  useEffect(() => {
    localStorage.setItem(WIDTH_KEY, String(width));
  }, [width]);

  // Save heights
  useEffect(() => {
    localStorage.setItem(HEIGHTS_KEY, JSON.stringify(heights));
  }, [heights]);

  const handleNoteChange = useCallback((key: keyof PadData, value: string) => {
    setNotes(prev => ({ ...prev, [key]: value }));
  }, []);

  // Panel width drag
  const startDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const maxW = window.innerWidth * 0.6;
      const newW = Math.max(MIN_WIDTH, Math.min(maxW, window.innerWidth - ev.clientX));
      setWidth(newW);
    };
    const onUp = () => { dragging.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-all"
        title="외부 뇌 패널"
      >
        <Brain size={16} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/20 backdrop-blur-[1px] transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full z-50 bg-card border-l border-border shadow-xl flex transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ width }}
      >
        {/* Resize handle */}
        <div
          onMouseDown={startDrag}
          className="w-1.5 cursor-col-resize hover:bg-primary/30 active:bg-primary/50 transition-colors flex-shrink-0"
        />

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Brain size={16} className="text-primary" /> 외부 뇌
            </h2>
            <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Pads */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {pads.map(pad => (
              <div key={pad.key} className={`rounded-lg border p-3 ${pad.color}`}>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">{pad.label}</label>
                <textarea
                  value={notes[pad.key]}
                  onChange={e => handleNoteChange(pad.key, e.target.value)}
                  placeholder="여기에 메모..."
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-y rounded-md p-2 border border-border/50 focus:border-primary/50 transition-colors"
                  style={{ height: heights[pad.key], minHeight: 80 }}
                  onMouseUp={e => {
                    const el = e.currentTarget;
                    if (el.offsetHeight !== heights[pad.key]) {
                      setHeights(prev => ({ ...prev, [pad.key]: el.offsetHeight }));
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
