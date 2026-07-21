/**
 * 원 단위 금액을 천 단위 콤마 표기로 변환한다.
 * 예) 235000 → "235,000원", 9900 → "9,900원"
 */
export function formatWon(won: number): string {
  return `${won.toLocaleString("ko-KR")}원`;
}
