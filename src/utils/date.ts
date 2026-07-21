/** 현재 시점의 기준 연·월. expenses API의 baseYear/baseMonth 인자로 쓴다. */
export function getBaseYearMonth() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1, // getMonth는 0-based
  };
}

/** ISO 날짜 문자열로부터 오늘까지 지난 일수(0 이상). 등록 경과일(D+N) 표시에 쓴다. */
export function daysSince(isoDate: string): number {
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return 0;
  const diffDays = Math.floor((Date.now() - then) / 86_400_000);
  return Math.max(0, diffDays);
}
