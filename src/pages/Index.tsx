import { useState, useCallback, useEffect } from "react";
import { getTodayTemplate, DayTemplate, WEEKLY_GOALS, templates as allTemplates } from "@/data/templates";
import { DaySelector } from "@/components/DaySelector";
import { WorkBlock } from "@/components/WorkBlock";
import { LongformCheck } from "@/components/LongformCheck";
import { FloatingNote } from "@/components/FloatingNote";
import { ProhibitionWarning } from "@/components/ProhibitionWarning";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { BlockTimer } from "@/components/BlockTimer";
import { BlockNotification } from "@/components/BlockNotification";
import { useViewMode } from "@/contexts/ViewModeContext";
import { Clock, Target, TrendingUp, Moon, Sun, MoonStar } from "lucide-react";

const Index = () => {
  const { mode } = useViewMode();
  const [template, setTemplate] = useState<DayTemplate>(getTodayTemplate);
  const [activeBlock, setActiveBlock] = useState<number>(0);
  const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set());
  const [longformDone, setLongformDone] = useState(false);
  const [showForceCheck, setShowForceCheck] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

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

  const completedCount = completedBlocks.size;
  const progressPercent = template.blocks.length > 0 ? (completedCount / template.blocks.length) * 100 : 0;

  const isSmall = mode === "small";
  const isLarge = mode === "large";

  const activeBlockData = template.blocks[activeBlock];

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
              onClick={() => handleBlockComplete(template.blocks[activeBlock].id)}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
            >
              ✅ 완료하고 넘어가기
            </button>
          </div>
        </div>
      )}

      <div className={`mx-auto ${isSmall ? "max-w-sm px-3 py-4" : isLarge ? "max-w-4xl px-6 py-8" : "max-w-2xl px-4 py-8"} space-y-${isSmall ? "3" : "6"}`}>
        {/* Header */}
        <header className={isSmall ? "space-y-2" : "space-y-4"}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`font-bold text-gradient ${isSmall ? "text-lg" : "text-2xl"}`}>FOCUS FLOW</h1>
              {!isSmall && <p className="text-xs text-muted-foreground font-mono mt-1">지혜샘 복구 모드</p>}
            </div>
            <div className="flex items-center gap-2">
              <ViewModeToggle />
              <BlockNotification blocks={template.blocks} activeBlock={activeBlock} />
              <button
                onClick={() => setDark(!dark)}
                className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-all"
                title={dark ? "라이트 모드" : "다크 모드"}
              >
                {dark ? <Sun size={16} /> : <MoonStar size={16} />}
              </button>
              {!isSmall && <DaySelector selected={template} onSelect={handleDayChange} />}
            </div>
          </div>

          {/* Small mode: compact current block info */}
          {isSmall ? (
            <div className="bg-card rounded-lg border border-border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{template.emoji} {template.dayKo}</span>
                <span className="text-xs font-mono text-primary font-bold">{completedCount}/{template.blocks.length}</span>
              </div>
              {activeBlockData && !completedBlocks.has(activeBlockData.id) && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{activeBlockData.title}</span>
                  <div className="flex items-center gap-2">
                    <BlockTimer
                      durationMinutes={activeBlockData.durationMinutes}
                      isActive={true}
                      onComplete={handleTimerEnd}
                      onStart={() => {}}
                      blockId={activeBlockData.id}
                      blockTitle={activeBlockData.title}
                      compact={true}
                    />
                    <button
                      onClick={() => handleBlockComplete(activeBlockData.id)}
                      className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground"
                    >
                      ✅
                    </button>
                  </div>
                </div>
              )}
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          ) : (
            /* Medium/Large day info card */
            <div className="bg-card rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">
                  {template.emoji} {template.dayKo} — {template.label}
                </h2>
              </div>
              <p className="text-sm text-primary font-medium">🎯 {template.goal}</p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock size={12} /> {template.totalHours}</span>
                <span className="flex items-center gap-1"><TrendingUp size={12} /> {template.blocks.length}블록</span>
                <span className="flex items-center gap-1"><Target size={12} /> {completedCount}/{template.blocks.length} 완료</span>
              </div>
              {template.blocks.length > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">오늘 완료율</span>
                    <span className="text-primary font-mono font-bold">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Rest day message */}
        {template.isRestDay ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center space-y-4">
            <Moon size={48} className="mx-auto text-muted-foreground" />
            <h3 className="text-lg font-bold text-foreground">완전 휴식</h3>
            <p className="text-sm text-muted-foreground">작업 금지 · 영상 분석도 금지</p>
            <p className="text-xs text-muted-foreground">오늘은 푹 쉬세요 🌙</p>
          </div>
        ) : !isSmall && (
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

        {/* Weekly goals — large mode only */}
        {isLarge && (
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
        )}

        {/* Weekly schedule — large mode only */}
        {isLarge && (
          <div className="bg-card rounded-xl border border-border p-4 space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">📅 주간 시간표</h3>
            <div className="space-y-2">
              {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => {
                const t = allTemplates.find((tmpl) => tmpl.day === day);
                if (!t) return null;
                const isCurrent = t.day === template.day;
                return (
                  <button
                    key={day}
                    onClick={() => handleDayChange(t)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                      isCurrent ? "bg-primary/10 border border-primary/30 text-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="font-medium">{t.emoji} {t.dayKo}</span>
                    <span>{t.label}</span>
                    <span className="font-mono">{t.totalHours}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer — hide in small mode */}
        {!isSmall && (
          <footer className="text-center py-4">
            <p className="text-xs text-muted-foreground">
              🌤 건강 엔진 유지 · 철학 브랜드 성장 · 리듬 복구 최우선
            </p>
          </footer>
        )}
      </div>
    </div>
  );
};

export default Index;
