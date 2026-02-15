import { useEffect, useState } from "react";
import { PROHIBITIONS } from "@/data/templates";
import { ShieldAlert, X } from "lucide-react";

export function ProhibitionWarning() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(Math.floor(Math.random() * PROHIBITIONS.length));
      setVisible(true);
    }, 25 * 60 * 1000);

    const timeout = setTimeout(() => {
      setCurrent(Math.floor(Math.random() * PROHIBITIONS.length));
      setVisible(true);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-slide-up">
      <div className="bg-card border border-warning/50 rounded-2xl p-8 max-w-md mx-4 glow-warning text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-warning/20 flex items-center justify-center animate-shake">
          <ShieldAlert size={32} className="text-warning" />
        </div>
        <h2 className="text-xl font-bold text-foreground">⚠️ 금지사항 경고</h2>
        <p className="text-warning text-lg font-semibold">{PROHIBITIONS[current]}</p>
        <button
          onClick={() => setVisible(false)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-secondary text-foreground hover:bg-accent transition-all text-sm"
        >
          <X size={16} /> 확인했습니다
        </button>
      </div>
    </div>
  );
}
