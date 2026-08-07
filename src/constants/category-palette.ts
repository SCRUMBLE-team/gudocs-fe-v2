// 카테고리 소비 분석 팔레트. 테마의 쨍한 아이콘 원색 대신, 조화롭고 CVD/대비 검증을
// 통과한 카테고리 색을 쓴다. light-dark()로 라이트/다크 모드의 각 스텝을 자동 선택한다.
// (adjacent CVD ΔE 9.1 light / 8.4 dark, normal-vision 19.6 / 19.3 통과)
// 홈 소비 분석 카드(analyze-expenses)와 소비 분석 페이지(analyze)가 색을 공유한다.
export const PIE_PALETTE = [
  "light-dark(#2a78d6, #3987e5)", // blue
  "light-dark(#eb6834, #d95926)", // orange
  "light-dark(#1baf7a, #199e70)", // aqua
  "light-dark(#eda100, #c98500)", // yellow
  "light-dark(#e87ba4, #d55181)", // magenta
  "light-dark(#008300, #008300)", // green
];

/**
 * top N 밖의 나머지 카테고리를 합산한 "그 외" 세그먼트 색.
 *
 * 팔레트의 마지막 초록을 그대로 쓴다. 도넛에서 여섯 번째 조각이 이 색이라
 * 막대와 도넛의 "그 외"가 같은 색으로 보인다.
 * (전에는 --color-text-tertiary였는데 이 토큰이 테마에 없어서 투명하게 렌더됐다.)
 */
export const REST_COLOR = PIE_PALETTE[5];
