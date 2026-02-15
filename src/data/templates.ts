export type Tool = "image" | "edit" | "voice" | "bgm" | "fx";

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
  color: "primary" | "warning" | "success" | "destructive" | "purple" | "neutral";
  blocks: BlockTask[];
  goal: string;
  totalHours: string;
  isRestDay?: boolean;
}

export const TOOLS_CONFIG: Record<string, { label: string; icon: string; count: number }> = {
  image: { label: "이미지", icon: "🖼️", count: 10 },
  edit: { label: "편집", icon: "✂️", count: 1 },
  voice: { label: "음성", icon: "🎙️", count: 1 },
  bgm: { label: "BGM", icon: "🎵", count: 1 },
  fx: { label: "효과음", icon: "🔊", count: 2 },
};

export const PROHIBITIONS = [
  "새 폰트 찾기 금지",
  "새 BGM 탐색 금지",
  "툴 비교 영상 보기 금지",
  "이미지 스타일 실험 금지",
  "완성도 90% 집착 금지",
  "자료 과다 조사 금지",
  "새 기획 시작 금지 (금요일만)",
  "감성 과몰입 금지",
  "영상미 실험 금지",
];

export const WEEKLY_GOALS = {
  longform: "2~3개",
  shorts: "2~4개",
  quality: "70%",
  uploads: "주 3회 이상",
};

export const templates: DayTemplate[] = [
  {
    day: "monday",
    dayKo: "월요일",
    label: "건강 롱폼 제작 DAY 💰",
    emoji: "🟢",
    color: "success",
    goal: "건강 롱폼 1개 완성 후 업로드",
    totalHours: "3시간",
    blocks: [
      {
        id: "mon-1",
        title: "건강 대본 작성",
        description: "수치 + 기사 + 실천법 구조 · 마지막에 철학 한 줄 연결",
        tools: [],
        rules: [
          "조사 30~40분 제한",
          "분량 8~12분",
          "자료 과다 조사 금지",
          "새 기획 시작 금지",
        ],
        durationMinutes: 90,
      },
      {
        id: "mon-2",
        title: "편집 & 업로드",
        description: "템플릿 고정 · 이미지 10장 이내 · BGM 1개 · 효과음 2개 이하",
        tools: ["edit", "image", "bgm", "fx"],
        rules: ["완성도 70%에서 업로드", "템플릿 고정 사용"],
        durationMinutes: 120,
      },
    ],
  },
  {
    day: "tuesday",
    dayKo: "화요일",
    label: "철학 쇼츠 DAY 🎥",
    emoji: "🔵",
    color: "primary",
    goal: "철학/명언 쇼츠 1~2개 제작",
    totalHours: "2~3시간",
    blocks: [
      {
        id: "tue-1",
        title: "쇼츠 기획",
        description: "한 문장 메시지 정하기 · 40~60초 구성 · 강한 첫 문장 만들기",
        tools: [],
        rules: ["감성 과몰입 금지", "영상미 실험 금지"],
        durationMinutes: 60,
      },
      {
        id: "tue-2",
        title: "쇼츠 제작 & 업로드",
        description: "기존 템플릿 사용 · 자막 스타일 고정 · 업로드 1~2개",
        tools: ["edit", "voice"],
        rules: ["깊이 금지 / 속도 위주", "자막 스타일 고정"],
        durationMinutes: 90,
      },
    ],
  },
  {
    day: "wednesday",
    dayKo: "수요일",
    label: "철학 롱폼 DAY 📚",
    emoji: "🟣",
    color: "purple",
    goal: "철학 롱폼 1개 제작",
    totalHours: "3시간",
    blocks: [
      {
        id: "wed-1",
        title: "철학 대본",
        description: "한 주제만 다루기 · 스토리 → 해석 → 현실 적용 구조 · 시니어 관점 유지",
        tools: [],
        rules: ["한 주제만 다루기", "시니어 관점 유지"],
        durationMinutes: 90,
      },
      {
        id: "wed-2",
        title: "편집 & 업로드",
        description: "이미지 8~10장 · 감성 BGM 1개 고정 · 70% 완성에서 업로드",
        tools: ["edit", "image", "bgm"],
        rules: ["완성도 70%에서 업로드", "이미지 스타일 실험 금지"],
        durationMinutes: 120,
      },
    ],
  },
  {
    day: "thursday",
    dayKo: "목요일",
    label: "가벼운 작업 DAY ✍",
    emoji: "🟡",
    color: "warning",
    goal: "부담 없이 유지하기",
    totalHours: "1~2시간",
    blocks: [
      {
        id: "thu-1",
        title: "커뮤니티 & 정리",
        description: "댓글 답변 · 커뮤니티 글 1개 · 다음 영상 아이디어 3개 정리",
        tools: [],
        rules: ["새 프로젝트 시작 금지", "가볍게 처리"],
        durationMinutes: 60,
      },
      {
        id: "thu-2",
        title: "썸네일 & 준비",
        description: "썸네일 템플릿 복사 저장 · 다음 주 준비",
        tools: ["image"],
        rules: ["이미지 스타일 실험 금지"],
        durationMinutes: 60,
      },
    ],
  },
  {
    day: "friday",
    dayKo: "금요일",
    label: "건강 or 브릿지 DAY 🔥",
    emoji: "🔴",
    color: "destructive",
    goal: "건강 또는 건강+철학 연결형 1개",
    totalHours: "3시간",
    blocks: [
      {
        id: "fri-1",
        title: "대본 작성",
        description: "건강 2편 or 철학+건강 연결편 · 월요일과 동일 구조 사용",
        tools: [],
        rules: [
          "조사 30~40분 제한",
          "분량 8~12분",
          "✔ 새 아이디어 실험 허용",
          "✔ 제목 테스트 가능",
        ],
        durationMinutes: 90,
      },
      {
        id: "fri-2",
        title: "편집 & 업로드",
        description: "템플릿 고정 · 이미지 10장 이내 · BGM 1개",
        tools: ["edit", "image", "bgm", "fx"],
        rules: ["완성도 70%에서 업로드"],
        durationMinutes: 120,
      },
    ],
  },
  {
    day: "saturday",
    dayKo: "토요일",
    label: "최소 유지 DAY 🌿",
    emoji: "⚪",
    color: "neutral",
    goal: "쇼츠 1개 or 블로그 1개 or 다음 주 주제 선정",
    totalHours: "1~2시간",
    blocks: [
      {
        id: "sat-1",
        title: "가벼운 작업",
        description: "쇼츠 1개 · 블로그 글 1개 · 다음 주 주제 선정 중 택 1",
        tools: [],
        rules: ["부담 없이 유지", "한 가지만 선택"],
        durationMinutes: 90,
      },
    ],
  },
  {
    day: "sunday",
    dayKo: "일요일",
    label: "완전 휴식 🌙",
    emoji: "⚫",
    color: "neutral",
    goal: "작업 금지 · 영상 분석도 금지",
    totalHours: "0시간",
    isRestDay: true,
    blocks: [],
  },
];

export function getTodayTemplate(): DayTemplate {
  const dayIndex = new Date().getDay();
  const dayMap: Record<number, string> = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };
  const day = dayMap[dayIndex] || "monday";
  return templates.find((t) => t.day === day) || templates[0];
}
