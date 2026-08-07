/** 현재 시점의 기준 연·월. expenses API의 baseYear/baseMonth 인자로 쓴다. */
export function getBaseYearMonth() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1, // getMonth는 0-based
  };
}

export type YearMonth = { year: number; month: number };

/**
 * 연·월에 개월 수를 더한다(음수면 뺀다). 해를 넘어가도 알아서 맞춘다.
 * month는 1-based라 0-based로 내렸다가 되돌린다.
 */
export function addMonths({ year, month }: YearMonth, amount: number): YearMonth {
  const zeroBased = year * 12 + (month - 1) + amount;
  return { year: Math.floor(zeroBased / 12), month: (zeroBased % 12) + 1 };
}

/** 두 연·월의 선후 비교. a가 b보다 앞이면 음수, 같으면 0, 뒤면 양수. */
export function compareYearMonth(a: YearMonth, b: YearMonth): number {
  return a.year * 12 + a.month - (b.year * 12 + b.month);
}

/** "2026.02"처럼 표시용으로 찍는다. */
export function formatYearMonth({ year, month }: YearMonth): string {
  return `${year}.${String(month).padStart(2, "0")}`;
}

/** "YYYY-MM-DD" ISO 문자열에서 연·월을 뽑는다. 캘린더가 보고 있는 월을 쿼리 인자로 넘길 때 쓴다. */
export function toYearMonth(iso: string) {
  const [year, month] = iso.split("-");
  return { year: Number(year), month: Number(month) };
}

/**
 * "YYYY-MM-DD" ISO 문자열에서 일(day)만 뽑는다.
 * Date를 거치면 타임존 때문에 날짜가 밀릴 수 있어 문자열 그대로 다룬다.
 */
export function toDayOfMonth(iso: string) {
  return Number(iso.split("-")[2]);
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
  const diffDays = Math.floor((then - Date.now()) / 86_400_000);
  return Math.max(0, diffDays);
}
