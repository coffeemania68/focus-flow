import { useState, useCallback } from "react";
import { getTodayTemplate, DayTemplate, TOOLS_CONFIG, WEEKLY_GOALS, PROHIBITIONS } from "@/data/templates";
import { DaySelector } from "@/components/DaySelector";
import { WorkBlock } from "@/components/WorkBlock";
import { LongformCheck } from "@/components/LongformCheck";
import { FloatingNote } from "@/components/FloatingNote";
import { ProhibitionWarning } from "@/components/ProhibitionWarning";
import { Clock, Target, TrendingUp, Moon } from "lucide-react";

const Index = () => {
  const [template, setTemplate] = useState<DayTemplate>(getTodayTemplate);
  const [activeBlock, setActiveBlock] = useState<number>(0);
  const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set());
  const [longformDone, setLongformDone] = useState(false);
  const [showForceCheck, setShowForceCheck] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleBlockComplete = useCallback((blockId: string) => {
    setCompletedBlocks((prev) => {
      const next = new Set(prev).add(blockId);
      if (next.size === template.blocks.length) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
      return next;
    });
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
    setShowCelebration(false);
  }, []);

  const totalMinutes = template.blocks.reduce((sum, b) => sum + b.durationMinutes, 0);
  const completedCount = completedBlocks.size;
  const progressPercent = template.blocks.length > 0 ? (completedCount / template.blocks.length) * 100 : 0;

  return (
    <div className="min-h-screen">
      <ProhibitionWarning />
      <FloatingNote />

      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-slide-up">
          <div className="bg-card border border-success/50 rounded-2xl p-10 max-w-sm mx-4 glow-success text-center space-y-4 animate-celebrate">
            <div className="text-6xl">🎉</div>
            <h2 className="text-xl font-bold text-success">오늘 블록 전부 완료!</h2>
            <p className="text-sm text-muted-foreground">잘했어요! 이제 쉬세요 🌿</p>
            <button
              onClick={() => setShowCelebration(false)}
              className="px-6 py-2.5 rounded-lg bg-success text-success-foreground text-sm font-medium hover:opacity-90 transition-all"
            >
              닫기
            </button>
          </div>
        </div>
      )}

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
              <p className="text-xs text-muted-foreground font-mono mt-1">지혜샘 복구 모드</p>
            </div>
            <DaySelector selected={template} onSelect={handleDayChange} />
          </div>

          {/* Day info with progress */}
          <div className="bg-card rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {template.emoji} {template.dayKo} — {template.label}
              </h2>
            </div>
            <p className="text-sm text-primary font-medium">🎯 {template.goal}</p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock size={12} /> {template.totalHours}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp size={12} /> {template.blocks.length}블록
              </span>
              <span className="flex items-center gap-1">
                <Target size={12} /> {completedCount}/{template.blocks.length} 완료
              </span>
            </div>
            {/* Progress bar */}
            {template.blocks.length > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">오늘 완료율</span>
                  <span className="text-primary font-mono font-bold">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Rest day message */}
        {template.isRestDay ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center space-y-4">
            <Moon size={48} className="mx-auto text-muted-foreground" />
            <h3 className="text-lg font-bold text-foreground">완전 휴식</h3>
            <p className="text-sm text-muted-foreground">작업 금지 · 영상 분석도 금지</p>
            <p className="text-xs text-muted-foreground">오늘은 푹 쉬세요 🌙</p>
          </div>
        ) : (
          <>
            {/* Longform check (only on longform days) */}
            {(template.day === "monday" || template.day === "wednesday" || template.day === "friday") && (
              <LongformCheck completed={longformDone} onToggle={() => setLongformDone(!longformDone)} />
            )}

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
          </>
        )}

        {/* Weekly goals */}
        <div className="bg-card rounded-xl border border-border p-4 space-y-2">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">📊 주간 목표</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-secondary rounded-lg px-3 py-2 text-xs">
              <span className="text-muted-foreground">롱폼</span>
              <span className="float-right font-mono text-foreground">{WEEKLY_GOALS.longform}</span>
            </div>
            <div className="bg-secondary rounded-lg px-3 py-2 text-xs">
              <span className="text-muted-foreground">쇼츠</span>
              <span className="float-right font-mono text-foreground">{WEEKLY_GOALS.shorts}</span>
            </div>
            <div className="bg-secondary rounded-lg px-3 py-2 text-xs">
              <span className="text-muted-foreground">완성도</span>
              <span className="float-right font-mono text-foreground">{WEEKLY_GOALS.quality}</span>
            </div>
            <div className="bg-secondary rounded-lg px-3 py-2 text-xs">
              <span className="text-muted-foreground">업로드</span>
              <span className="float-right font-mono text-foreground">{WEEKLY_GOALS.uploads}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            🌤 건강 엔진 유지 · 철학 브랜드 성장 · 리듬 복구 최우선
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
