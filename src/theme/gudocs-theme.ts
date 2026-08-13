import { defineTheme } from "@astryxdesign/core/theme";
import { neutralTheme } from "@astryxdesign/theme-neutral";

/**
 * 브랜드 테마.
 *
 * 토스 모바일 디자인 시스템(TDS)의 인상을 최대한 가깝게 맞추는 것이 목표다.
 * TDS의 특징은 (1) Pretendard 계열 산세리프, (2) 큰 모서리 반경,
 * (3) 큼직한 볼드 타이틀, (4) 높고 둥근 CTA 버튼이다.
 *
 * 색: accent를 hex로 먼저 넘겨 accent 계열 토큰(--color-on-accent 포함)을
 * 생성시킨 뒤, light 모드 값만 브랜드 지정값으로 정확히 덮어쓴다.
 * dark 모드는 시스템 생성값을 유지한다 — 브랜드 원색을 어두운 배경에
 * 그대로 쓰면 대비가 3.5:1까지 떨어져 본문 기준(4.5:1)에 미달한다.
 *
 * 대비 검증 (light):
 *   흰색 on #1F4DF3      → 6.15:1  (본문 AA 통과)
 *   #202632 on #FCFCFF   → 14.8:1  (AAA 통과)
 */
export const gudocsTheme = defineTheme({
  name: "gudocs",
  extends: neutralTheme,

  color: {
    accent: "#1F4DF3", // 브랜드 블루
    neutralStyle: "cool",
  },

  // Toss Product Sans는 비공개 폰트라 사실상 표준 대체재인 Pretendard를 쓴다.
  typography: {
    scale: { base: 15, ratio: 1.28 },
    // 폰트 파일 자체는 테마가 아니라 index.css에서 불러온다.
    body: {
      family: "Pretendard Variable",
      fallbacks:
        "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    },
    heading: {
      family: "Pretendard Variable",
      fallbacks:
        "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    },
  },

  // TDS는 카드처럼 큰 면은 크게 깎지만 버튼·입력은 과하게 둥글지 않다.
  // multiplier를 올리면 작은 요소까지 알약 모양이 되므로 기본값 근처로 둔다.
  radius: { base: 6, multiplier: 1 },

  tokens: {
    "--color-accent": ["#1F4DF3", "#C9BEFF"],
    "--color-text-primary": ["#202632", "#E2E1EB"], // Toss Gray

    // 테두리·구분선도 Toss Gray 기준으로. 시스템 기본값과 동일한 알파 방식을
    // 유지해서 배경색이 바뀌어도 자연스럽게 섞이게 한다.
    // (원색 #202632를 그대로 쓰면 1px 선이 지나치게 강해진다.)
    "--color-border": ["#2026321A", "#F0F0F91A"],
    "--color-border-emphasized": ["#20263259", "#464552"],
  },

  components: {
    // TDS 카드: 넉넉한 패딩 + 큰 반경
    card: {
      base: { borderRadius: "24px", padding: "24px" },
    },
    // TDS CTA: 높고 두껍되, 모서리는 알약이 아니라 완만한 라운드
    button: {
      base: { borderRadius: "10px", fontWeight: "700" },
      "size:lg": { minHeight: "56px", fontSize: "17px", borderRadius: "12px" },
    },
    dialog: {
      base: { borderRadius: "24px" },
    },
  },
});
