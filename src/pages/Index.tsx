import { useState, useCallback } from "react";
import { getTodayTemplate, DayTemplate, TOOLS_CONFIG } from "@/data/templates";
import { DaySelector } from "@/components/DaySelector";
import { WorkBlock } from "@/components/WorkBlock";
import { LongformCheck } from "@/components/LongformCheck";
import { FloatingNote } from "@/components/FloatingNote";
import { ProhibitionWarning } from "@/components/ProhibitionWarning";
import { Zap, Clock, Target } from "lucide-react";

const Index = () => {
  const [template, setTemplate] = useState<DayTemplate>(getTodayTemplate);
  const [activeBlock, setActiveBlock] = useState<number>(0);
  const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set());
  const [longformDone, setLongformDone] = useState(false);
  const [showForceCheck, setShowForceCheck] = useState(false);

  const handleBlockComplete = useCallback((blockId: string) => {
    setCompletedBlocks((prev) => new Set(prev).add(blockId));
    setActiveBlock((prev) => Math.min(prev + 1, template.blocks.length - 1));
    setShowForceCheck(false);
  }, [template.blocks.length]);

  const handleTimerEnd = useCallback(() => {
    setShowForceCheck(true);
  }, []);

  const handleDayChange = useCallback((t: DayTemplate) => {
    setTemplate(t);
    setActiveBlock(0);
    setCompletedBlocks(new Set());
    setLongformDone(false);
    setShowForceCheck(false);
  }, []);

  const totalMinutes = template.blocks.reduce((sum, b) => sum + b.durationMinutes, 0);
  const completedCount = completedBlocks.size;

  return (
    <div className="min-h-screen bg-background">
      <ProhibitionWarning />
      <FloatingNote />

      {/* Force check modal */}
      {showForceCheck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-warning/50 rounded-2xl p-8 max-w-sm mx-4 glow-warning text-center space-y-4 animate-slide-up">
            <div className="text-4xl">⏰</div>
            <h2 className="text-lg font-bold text-foreground">블록 시간 종료!</h2>
            <p className="text-sm text-muted-foreground">작업을 완료 체크하고 다음 블록으로 이동하세요.</p>
            <button
              onClick={() => {
                handleBlockComplete(template.blocks[activeBlock].id);
              }}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
            >
              ✅ 완료하고 넘어가기
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient">FOCUS FLOW</h1>
              <p className="text-xs text-muted-foreground font-mono mt-1">ADHD 최적화 스케줄러</p>
            </div>
            <DaySelector selected={template} onSelect={handleDayChange} />
          </div>

          {/* Day info */}
          <div className="bg-card rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {template.emoji} {template.dayKo} — {template.label}
              </h2>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock size={12} /> {Math.floor(totalMinutes / 60)}시간 {totalMinutes % 60}분
              </span>
              <span className="flex items-center gap-1">
                <Zap size={12} /> {template.blocks.length}블록
              </span>
              <span className="flex items-center gap-1">
                <Target size={12} /> {completedCount}/{template.blocks.length} 완료
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / template.blocks.length) * 100}%` }}
              />
            </div>
          </div>
        </header>

        {/* Longform check */}
        <LongformCheck completed={longformDone} onToggle={() => setLongformDone(!longformDone)} />

        {/* Tools summary */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(TOOLS_CONFIG).map(([key, tool]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-xs text-secondary-foreground"
            >
              {tool.icon} {tool.label} ×{tool.count}
            </span>
          ))}
        </div>

        {/* Blocks */}
        <div className="space-y-3">
          {template.blocks.map((block, i) => (
            <WorkBlock
              key={block.id}
              block={block}
              index={i}
              isActive={activeBlock === i && !completedBlocks.has(block.id)}
              isCompleted={completedBlocks.has(block.id)}
              onActivate={() => setActiveBlock(i)}
              onComplete={() => handleBlockComplete(block.id)}
              onTimerEnd={handleTimerEnd}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center py-6">
          <p className="text-xs text-muted-foreground">
            🔥 하루 1롱폼 · 조사 40분 제한 · 새 기획은 금요일만
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
