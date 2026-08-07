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
 * 서비스 로고. 파일명이 카탈로그의 code(UPPER_SNAKE)와 같다.
 *
 * 표시 이름은 오타 수정·브랜드 변경으로 바뀌므로 조인 키로 쓸 수 없다.
 * (실제로 "디지니플러스" 오타를 고칠 때 저장된 데이터와 어긋난 적이 있다.)
 * code는 불변이라 이름이 바뀌어도 로고가 따라 깨지지 않는다.
 */
const LOGO_URLS = import.meta.glob("../assets/logo/service/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

/** 카탈로그 code로 로고 URL을 찾는다. 아직 로고가 없는 서비스는 undefined. */
export function getServiceLogo(code: string | null | undefined) {
  if (!code) return undefined;
  return LOGO_URLS[`../assets/logo/service/${code}.png`];
}
