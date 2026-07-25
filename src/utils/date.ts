/** 현재 시점의 기준 연·월. expenses API의 baseYear/baseMonth 인자로 쓴다. */
export function getBaseYearMonth() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1, // getMonth는 0-based
  };
}

/** "YYYY-MM-DD" ISO 문자열에서 연·월을 뽑는다. 캘린더가 보고 있는 월을 쿼리 인자로 넘길 때 쓴다. */
export function toYearMonth(iso: string) {
  const [year, month] = iso.split("-");
  return { year: Number(year), month: Number(month) };
}

/**
 * Date -> "YYYY-MM-DD".
 * toISOString()은 UTC로 변환하므로 한국 시간 자정 근처에서 날짜가 하루
 * 밀린다. 로컬 기준 연·월·일을 그대로 조합한다.
 */
export function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** "YYYY-MM-DD" -> 로컬 기준 Date. */
export function fromISODate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** ISO 날짜 문자열로부터 오늘까지 지난 일수(0 이상). 등록 경과일(D+N) 표시에 쓴다. */
export function daysSince(isoDate: string): number {
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return 0;
  const diffDays = Math.floor((Date.now() - then) / 86_400_000);
  return Math.max(0, diffDays);
}
