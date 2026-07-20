export const CATEGORY_META = {
  OTT: {
    label: "영상",
    emoji: "🎬",
    icon: "icon-logo-youtube-red",
  },
  MUSIC: {
    label: "음악",
    emoji: "🎵",
    icon: "icon-guitar-fill",
  },
  CLOUD: {
    label: "클라우드",
    emoji: "☁️",
    icon: "icon-folder-cloud",
  },
  PRODUCTIVITY: {
    label: "생산성",
    emoji: "💼",
    icon: "icon-document-bluedot",
  },
  AI: {
    label: "AI 서비스",
    emoji: "🤖",
    icon: "icon-robot-blue",
  },
  NEWS: { label: "뉴스/콘텐츠", emoji: "📰", icon: "icon-newspaper" },
  EDUCATION: {
    label: "교육/강의",
    emoji: "📚",
    icon: "icon-education",
  },
  GAME: { label: "게임", emoji: "🎮", icon: "icon-alltab-game" },
  SHOPPING: {
    label: "쇼핑 멤버십",
    emoji: "🛍️",
    icon: "icon-shopping-bag-discount-blue",
  },
  DESIGN: { label: "디자인", emoji: "🎨", icon: "icon-clothes-circle" },
  ETC: { label: "기타", emoji: "📦", icon: "icon-safe-box-deepblue" },
} as const satisfies Record<
  string,
  { label: string; icon: string; emoji: string }
>;

/** 카테고리별로 선택 가능한 실제 서비스 목록 */
export const CATEGORY_SERVICES = {
  OTT: [
    "넷플릭스",
    "디지니플러스",
    "티빙",
    "쿠팡플레이",
    "왓챠",
    "웨이브",
    "아마존프라임비디오",
    "애플TV",
  ],
  MUSIC: ["FLO", "유튜브뮤직", "스포티파이", "멜론", "애플뮤직"],
  CLOUD: ["iCloud", "Google Drive", "Dropbox", "네이버 클라우드", "OneDrive"],
  PRODUCTIVITY: ["Notion", "Microsoft 365", "Slack", "Google Workspace"],
  AI: ["ChatGPT", "Claude", "Perplexity", "Gemini"],
  NEWS: ["NYT", "Medium", "퍼블리", "롱블랙"],
  EDUCATION: ["Inflearn", "Udemy", "Coursera", "클래스101"],
  GAME: ["Xbox Game Pass", "PS Plus", "Nintendo Switch Online"],
  SHOPPING: ["쿠팡 와우", "네이버플러스", "SSG.COM 유니버스클럽"],
  DESIGN: ["Figma", "Adobe CC", "Canva"],
  ETC: [],
} as const satisfies Record<keyof typeof CATEGORY_META, readonly string[]>;
