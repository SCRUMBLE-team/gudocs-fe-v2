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

/**
 * assets/logo 하위 png들을 URL로 한 번에 로드한다. (Vite import.meta.glob, eager)
 * 키는 `../assets/logo/<category>/<file>.png` 형태.
 */
const LOGO_URLS = import.meta.glob("../assets/logo/**/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const logo = (path: string): string => LOGO_URLS[`../assets/logo/${path}`];

export type ServiceOption = { name: string; logo: string };

/** 카테고리별로 선택 가능한 실제 서비스 목록 (로고 포함) */
export const CATEGORY_SERVICES = {
  OTT: [
    { name: "유튜브 프리미엄", logo: logo("video/youtube.png") },
    { name: "넷플릭스", logo: logo("video/netflix.png") },
    { name: "디지니플러스", logo: logo("video/disney_plus.png") },
    { name: "티빙", logo: logo("video/tving.png") },
    { name: "쿠팡플레이", logo: logo("video/coupang_play.png") },
    { name: "왓챠", logo: logo("video/watcha.png") },
    { name: "웨이브", logo: logo("video/wave.png") },
    { name: "아마존프라임비디오", logo: logo("video/amazone_prime_video.png") },
    { name: "애플TV", logo: logo("video/appleTV.png") },
  ],
  MUSIC: [
    { name: "FLO", logo: logo("music/flo.png") },
    { name: "유튜브뮤직", logo: logo("music/youtube_music.png") },
    { name: "스포티파이", logo: logo("music/spotify.png") },
    { name: "멜론", logo: logo("music/melon.png") },
    { name: "애플뮤직", logo: logo("music/apple_music.png") },
  ],
  CLOUD: [
    { name: "iCloud", logo: logo("cloud/icloud.png") },
    { name: "Google Drive", logo: logo("cloud/google_cloud.png") },
    { name: "Dropbox", logo: logo("cloud/dropbox.png") },
    { name: "네이버 클라우드", logo: logo("cloud/naver_cloud.png") },
    { name: "OneDrive", logo: logo("cloud/onedrive.png") },
  ],
  PRODUCTIVITY: [
    { name: "Notion", logo: logo("productivity/notion.png") },
    { name: "Microsoft 365", logo: logo("productivity/microsoft.png") },
    { name: "Slack", logo: logo("productivity/slack.png") },
    {
      name: "Google Workspace",
      logo: logo("productivity/google_workspace.png"),
    },
  ],
  AI: [
    { name: "ChatGPT", logo: logo("ai/gpt.png") },
    { name: "Claude", logo: logo("ai/claude.png") },
    { name: "Perplexity", logo: logo("ai/perplexity.png") },
    { name: "Gemini", logo: logo("ai/geminai.png") },
  ],
  NEWS: [
    { name: "NYT", logo: logo("news/NYT.png") },
    { name: "Medium", logo: logo("news/medium.png") },
    { name: "퍼블리", logo: logo("news/publy.png") },
    { name: "롱블랙", logo: logo("news/long_black.png") },
  ],
  EDUCATION: [
    { name: "인프런", logo: logo("education/inflearn.png") },
    { name: "Udemy", logo: logo("education/udemy.png") },
    { name: "Coursera", logo: logo("education/coursera.png") },
    { name: "클래스101", logo: logo("education/class101.png") },
  ],
  GAME: [
    { name: "Xbox Game Pass", logo: logo("game/xbox.png") },
    { name: "PS Plus", logo: logo("game/ps_plus.png") },
    { name: "Nintendo Switch Online", logo: logo("game/nintendo_switch.png") },
  ],
  SHOPPING: [
    { name: "쿠팡 와우", logo: logo("shopping/coupang.png") },
    { name: "네이버플러스", logo: logo("shopping/naver_plus.png") },
    { name: "SSG.COM 유니버스클럽", logo: logo("shopping/ssg.png") },
  ],
  DESIGN: [
    { name: "Figma", logo: logo("design/figma.png") },
    { name: "Adobe CC", logo: logo("design/adobe.png") },
    { name: "Canva", logo: logo("design/canva.png") },
  ],
  ETC: [],
} satisfies Record<keyof typeof CATEGORY_META, readonly ServiceOption[]>;

/** 서비스명 → 로고 URL 조회 맵. 구독 목록 등 이름만 있는 곳에서 로고를 찾을 때 쓴다. */
const SERVICE_LOGO_BY_NAME: Record<string, string> = Object.fromEntries(
  Object.values(CATEGORY_SERVICES)
    .flat()
    .map((s) => [s.name, s.logo]),
);

/** 서비스명으로 로고 URL을 찾는다. 등록된 로고가 없으면 undefined. */
export function getServiceLogo(name: string | undefined): string | undefined {
  return name ? SERVICE_LOGO_BY_NAME[name] : undefined;
}
