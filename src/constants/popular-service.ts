/**
 * 등록 첫 화면에 검색 없이 바로 노출하는 서비스.
 *
 * 이름·카테고리·요금제는 카탈로그가 단일 소스이므로 여기서는 code만 든다.
 * 카탈로그에서 빠지거나 selectable이 false가 되면 목록에서 조용히 사라진다.
 *
 * 순서가 곧 노출 순서다. 나중에 실제 등록 통계가 쌓이면 서버가 내려주는 값으로
 * 갈아끼우면 되고, 그때까지는 손으로 고른 목록을 쓴다.
 */
export const POPULAR_SERVICE_CODES = [
  "NETFLIX",
  "YOUTUBE_PREMIUM",
  "COUPANG_WOW",
  "TVING",
  "SPOTIFY",
  "CHATGPT",
];
