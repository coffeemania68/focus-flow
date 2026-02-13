export type Tool = "image" | "edit" | "voice" | "bgm";

export interface BlockTask {
  id: string;
  title: string;
  description: string;
  tools?: Tool[];
  rules: string[];
  durationMinutes: number;
}

export interface DayTemplate {
  day: string;
  dayKo: string;
  label: string;
  emoji: string;
  color: "primary" | "warning" | "success" | "destructive";
  blocks: BlockTask[];
}

export const TOOLS_CONFIG = {
  image: { label: "이미지 생성", icon: "🖼️", count: 1 },
  edit: { label: "편집 툴", icon: "✂️", count: 1 },
  voice: { label: "음성 툴", icon: "🎙️", count: 1 },
  bgm: { label: "BGM", icon: "🎵", count: 3 },
} as const;

export const PROHIBITIONS = [
  "조사 시간 40분 초과 금지",
  "하루 1롱폼 이상 금지",
  "새 기획은 금요일만 허용",
  "블록2에서 창의성 발휘 금지",
  "편집 시 완벽주의 금지 (80%면 게시)",
  "과몰입 시 즉시 타이머 확인",
];

export const templates: DayTemplate[] = [
  {
    day: "monday",
    dayKo: "월요일",
    label: "건강 제작 DAY 💰",
    emoji: "🟢",
    color: "success",
    blocks: [
      {
        id: "mon-1",
        title: "깊은 작업 (건강 대본)",
        description: "수치 + 기사 + 실천법 기반 건강 대본 작성",
        tools: [],
        rules: ["조사 타이머 30~40분 제한", "분량 12분 이내", "과몰입 금지 → 타이머 필수"],
        durationMinutes: 90,
      },
      {
        id: "mon-2",
        title: "제작 세팅",
        description: "AI 음성 · 이미지 생성 · 파일 정리 · BGM 템플릿",
        tools: ["image", "voice", "bgm"],
        rules: ["창의성 발휘 금지", "반복 작업처럼 처리"],
        durationMinutes: 90,
      },
      {
        id: "mon-3",
        title: "편집",
        description: "컷 편집 · 자막 · 썸네일 · 업로드 예약",
        tools: ["edit"],
        rules: ["완벽주의 금지", "80%면 게시"],
        durationMinutes: 120,
      },
      {
        id: "mon-4",
        title: "수익 확장 (블로그)",
        description: "블로그 숫자 확장 글 작성",
        tools: [],
        rules: ["가볍게 처리"],
        durationMinutes: 60,
      },
    ],
  },
  {
    day: "tuesday",
    dayKo: "화요일",
    label: "쇼츠 DAY ⚡",
    emoji: "🟢",
    color: "warning",
    blocks: [
      {
        id: "tue-1",
        title: "쇼츠 추출",
        description: "월요일 영상에서 쇼츠 3개 뽑기",
        tools: ["edit"],
        rules: ["깊이 금지", "속도 위주"],
        durationMinutes: 90,
      },
      {
        id: "tue-2",
        title: "어그로 쇼츠",
        description: "니체 어그로 쇼츠 2개 제작",
        tools: ["edit", "voice"],
        rules: ["깊이 금지", "속도 위주"],
        durationMinutes: 90,
      },
      {
        id: "tue-3",
        title: "쇼츠 마무리",
        description: "총 4~5개 최종 편집 및 업로드",
        tools: ["edit"],
        rules: ["완벽주의 금지"],
        durationMinutes: 90,
      },
      {
        id: "tue-4",
        title: "쇼츠 예약 업로드",
        description: "썸네일 + 예약 설정",
        tools: [],
        rules: ["빠르게 처리"],
        durationMinutes: 60,
      },
    ],
  },
  {
    day: "wednesday",
    dayKo: "수요일",
    label: "철학 제작 DAY 🧠",
    emoji: "🟢",
    color: "primary",
    blocks: [
      {
        id: "wed-1",
        title: "깊은 작업 (철학 대본)",
        description: "짜라 시리즈: 무협 서사 → 원전 설명 → 니체 연결 → 시니어 해석",
        tools: [],
        rules: ["12~15분 이내", "조사 타이머 40분 제한"],
        durationMinutes: 90,
      },
      {
        id: "wed-2",
        title: "제작 세팅",
        description: "AI 음성 · 이미지 생성 · BGM 템플릿",
        tools: ["image", "voice", "bgm"],
        rules: ["창의성 발휘 금지", "반복 작업처럼 처리"],
        durationMinutes: 90,
      },
      {
        id: "wed-3",
        title: "편집",
        description: "컷 편집 · 자막 · 썸네일 · 업로드 예약",
        tools: ["edit"],
        rules: ["완벽주의 금지", "80%면 게시"],
        durationMinutes: 120,
      },
      {
        id: "wed-4",
        title: "키워드 / 썸네일 실험",
        description: "SEO 키워드 리서치 + 썸네일 A/B 테스트",
        tools: [],
        rules: ["실험 기록 남기기"],
        durationMinutes: 60,
      },
    ],
  },
  {
    day: "thursday",
    dayKo: "목요일",
    label: "블로그 + SEO DAY 📝",
    emoji: "🟢",
    color: "warning",
    blocks: [
      {
        id: "thu-1",
        title: "블로그 작성 1",
        description: "수요일 철학 영상 확장 블로그",
        tools: [],
        rules: ["숫자, 표, 역사 자료 추가"],
        durationMinutes: 90,
      },
      {
        id: "thu-2",
        title: "블로그 작성 2",
        description: "추가 블로그 글 작성",
        tools: [],
        rules: ["내부 링크 정리"],
        durationMinutes: 90,
      },
      {
        id: "thu-3",
        title: "SEO 최적화",
        description: "키워드 최적화 + 메타데이터 정리",
        tools: [],
        rules: ["데이터 기반으로만 판단"],
        durationMinutes: 90,
      },
      {
        id: "thu-4",
        title: "내부 링크 정리",
        description: "블로그 간 내부 링크 구조 최적화",
        tools: [],
        rules: ["가볍게 처리"],
        durationMinutes: 60,
      },
    ],
  },
  {
    day: "friday",
    dayKo: "금요일",
    label: "건강 2편 + 기획 DAY 🎯",
    emoji: "🟢",
    color: "success",
    blocks: [
      {
        id: "fri-1",
        title: "건강 or 연결 콘텐츠",
        description: "가볍게 건강 2편 or 철학+건강 연결편 제작",
        tools: ["voice", "image"],
        rules: ["가볍게 제작"],
        durationMinutes: 90,
      },
      {
        id: "fri-2",
        title: "편집 + 업로드",
        description: "편집 완료 및 업로드 예약",
        tools: ["edit"],
        rules: ["80%면 게시"],
        durationMinutes: 90,
      },
      {
        id: "fri-3",
        title: "다음주 기획",
        description: "다음주 콘텐츠 주제 선정 + 리서치 시작",
        tools: [],
        rules: ["새 기획은 금요일만 허용"],
        durationMinutes: 90,
      },
      {
        id: "fri-4",
        title: "주간 리뷰",
        description: "이번주 성과 정리 + 개선점 기록",
        tools: [],
        rules: ["솔직하게 기록"],
        durationMinutes: 60,
      },
    ],
  },
];

export function getTodayTemplate(): DayTemplate {
  const dayIndex = new Date().getDay();
  const dayMap: Record<number, string> = {
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
  };
  const day = dayMap[dayIndex] || "monday";
  return templates.find((t) => t.day === day) || templates[0];
}
