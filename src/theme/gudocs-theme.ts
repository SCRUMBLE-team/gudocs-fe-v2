import { defineTheme } from "@astryxdesign/core/theme";
import { neutralTheme } from "@astryxdesign/theme-neutral";

/**
 * 브랜드 테마.
 *
 * 레이아웃·타이포·모서리는 토스 모바일 디자인 시스템(TDS)의 인상을 따르고,
 * 색만 9docs 브랜드 팔레트로 맞춘다.
 * TDS의 특징은 (1) Pretendard 계열 산세리프, (2) 큰 모서리 반경,
 * (3) 큼직한 볼드 타이틀, (4) 높고 둥근 CTA 버튼이다.
 *
 * 색: accent를 hex로 먼저 넘겨 accent 계열 토큰(--color-on-accent 포함)을
 * 생성시킨 뒤, light 모드 값만 브랜드 지정값으로 정확히 덮어쓴다.
 * dark 모드는 시스템 생성값을 유지한다 — 브랜드 원색을 어두운 배경에
 * 그대로 쓰면 대비가 3.5:1까지 떨어져 본문 기준(4.5:1)에 미달한다.
 * (앱은 main.tsx에서 mode="light" 고정이라 dark 값은 현재 쓰이지 않는다.)
 *
 * 대비 검증 (light):
 *   흰색 on Primary #4971B5      → 4.87:1  (본문 AA 통과)
 *   Text Primary on Background   → 14.0:1  (AAA 통과)
 *   Text Primary on Warning      →  5.34:1 (AA 통과)
 *   흰색 on Success/Danger/Info  →  3.2~3.7:1 (UI 요소 3:1은 통과, 본문 AA 미달)
 *     └ 팔레트 자체가 채도를 낮춘 톤이라 생기는 한계. 상태색은 아이콘·테두리·
 *       배지처럼 큰 글자/비텍스트 용도로만 쓰고, 본문 텍스트에는 쓰지 않는다.
 */
/**
 * 팔레트에는 있지만 astryx에 대응 토큰이 없는 값들.
 *
 * - Primary Hover/Active: astryx는 accent 위에 tint를 덮는 방식이라 별도 토큰이 없다.
 * - Primary Extra Light: 오버레이가 아닌 불투명 배경이 필요한 곳(테이블 선택 영역 등)용.
 * - Text Tertiary: astryx 텍스트 토큰은 primary/secondary/disabled 3단계뿐이다.
 * - Border Light: 카드 구분선. astryx는 border/border-emphasized 2단계뿐이다.
 *
 * defineTheme의 tokens 타입은 알려진 토큰명만 허용하므로 스프레드로 넣는다.
 * CSS 변수로는 정상 출력되며 `var(--color-text-tertiary)`처럼 직접 참조해서 쓴다.
 */
const brandExtras = {
  "--color-accent-hover": ["#3F639E", "#3F639E"], // Primary Hover
  "--color-accent-active": ["#355487", "#355487"], // Primary Active
  "--color-accent-subtle": ["#F4F8FD", "#F4F8FD"], // Primary Extra Light
  "--color-text-tertiary": ["#6B7280", "#8C909E"], // Text Tertiary
  "--color-border-light": ["#EEF2F6", "#EEF0FA0D"], // Border Light
} as Record<string, [string, string]>;

export const gudocsTheme = defineTheme({
  name: "gudocs",
  extends: neutralTheme,

  color: {
    accent: "#4971B5", // Brand Primary
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

  // 각 토큰의 light 값 = 브랜드 팔레트 지정값,
  // dark 값 = accent #4971B5 기준으로 생성된 값.
  tokens: {
    // ── Brand ───────────────────────────────────────────────
    "--color-accent": ["#4971B5", "#AEC6FF"], // Primary
    "--color-accent-muted": [
      "#EAF1FB", // Primary Light — 선택된 카드, 태그, 통계 카드 배경
      "color-mix(in srgb, var(--color-accent) 25%, transparent)",
    ],
    "--color-on-accent": ["#FFFFFF", "#003171"], // Text Inverse

    ...brandExtras,

    // ── Background ──────────────────────────────────────────
    "--color-background-body": ["#F8FAFC", "#0E1118"], // Background
    "--color-background-surface": ["#FFFFFF", "#191B22"], // Surface
    "--color-background-card": ["#FFFFFF", "#191B22"],
    "--color-background-popover": ["#FFFFFF", "#2E3037"],
    "--color-background-muted": ["#F5F7FA", "#191B2280"], // Surface Secondary
    "--color-background-inverted": ["#1F2937", "#FFFFFF"],

    // Surface Hover(#EEF3F8) / Primary Extra Light(#F4F8FD)에 해당한다.
    // 오버레이는 표면 위에 겹쳐지므로 불투명 hex 대신 같은 결과를 내는
    // Primary 알파값으로 둔다 (흰 배경 위에서 각각 ≈#F4F7FB, ≈#EDF1F7).
    "--color-overlay-hover": ["#4971B50D", "#FFFFFF0D"],
    "--color-overlay-pressed": ["#4971B51A", "#FFFFFF1A"],

    // ── Text / Icon ─────────────────────────────────────────
    "--color-text-primary": ["#1F2937", "#E0E2EC"],
    "--color-text-secondary": ["#4B5563", "#A7ABB9"],
    "--color-text-disabled": ["#9CA3AF", "#5A5E6B"],
    "--color-icon-primary": ["#1F2937", "#E0E2EC"],
    "--color-icon-secondary": ["#4B5563", "#A7ABB9"],
    "--color-icon-disabled": ["#9CA3AF", "#5A5E6B"],
    // ── Border ──────────────────────────────────────────────
    "--color-border": ["#D9E2EC", "#EEF0FA1A"], // Border Default
    "--color-border-emphasized": ["#C2CEDB", "#424653"], // Border Strong
    "--color-skeleton": ["#C2CEDB", "#424653"],
    "--color-track": ["#C2CEDB", "#424653"],

    // ── Status ──────────────────────────────────────────────
    "--color-success": ["#5F9E78", "#9FE59B"],
    "--color-success-muted": ["#EEF7F1", "#84C9803D"],
    "--color-warning": ["#C7924A", "#FDCF4F"],
    "--color-warning-muted": ["#FCF6EC", "#DEB4333D"],
    "--color-error": ["#C56A6A", "#FFC6C1"],
    "--color-error-muted": ["#FAF0F0", "#FF9E973D"],
    "--color-on-success": ["#FFFFFF", "#171717"],
    "--color-on-error": ["#FFFFFF", "#171717"],
    "--color-on-warning": ["#1F2937", "#171717"], // Warning은 밝아서 어두운 글자

    // Info는 astryx의 blue 계열 토큰이 담당한다.
    "--color-background-blue": ["#EEF3FB", "#9EB7FF3D"], // Info Light
    "--color-border-blue": ["#6D8FC2", "#6D9CFE"], // Info
    "--color-icon-blue": ["#6D8FC2", "#9EB7FF"],
    "--color-text-blue": ["#355487", "#C7D3FF"], // 연한 Info 배경 위 본문용(6.9:1)

    // ── Accent Yellow (절약 금액, 추천, Premium) ─────────────
    "--color-background-yellow": ["#FCF8EA", "#DEB4333D"], // Accent Yellow Light
    "--color-border-yellow": ["#E3B94F", "#C0990E"], // Accent Yellow
    "--color-icon-yellow": ["#E3B94F", "#DEB433"],

    // ── Neutral(gray) 계열도 팔레트 기준으로 ────────────────
    "--color-background-gray": ["#EEF2F6", "var(--color-neutral)"],
    "--color-border-gray": ["#D9E2EC", "#424653"],
    "--color-icon-gray": ["#4B5563", "#A7ABB9"],
    "--color-text-gray": ["#1F2937", "#E0E2EC"],

    // 입력 포커스/호버 링. 기본값이 이전 브랜드 색(#0074e2)으로 박혀 있어 덮어쓴다.
    "--shadow-inset-hover": "inset 0px 0px 0px 2px #4971B54D",
    "--shadow-inset-selected": "inset 0px 0px 0px 2px #4971B580",
    "--shadow-inset-success": "inset 0px 0px 0px 2px #5F9E784D",
    "--shadow-inset-warning": "inset 0px 0px 0px 2px #C7924A4D",
    "--shadow-inset-error": "inset 0px 0px 0px 2px #C56A6A4D",
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

    // 아래 세 컴포넌트는 베이스 테마가 상태색을 hex로 박아둬서
    // 토큰만 바꾸면 이전 브랜드 색이 그대로 남는다. 팔레트 값으로 덮어쓴다.
    badge: {
      "variant:info": { backgroundColor: "#6D8FC2", color: "#FFFFFF" },
      "variant:success": { backgroundColor: "#5F9E78", color: "#FFFFFF" },
      "variant:warning": { backgroundColor: "#C7924A", color: "#1F2937" },
      "variant:error": { backgroundColor: "#C56A6A", color: "#FFFFFF" },
    },
    progressbar: {
      "variant:accent": { "--color-accent": "light-dark(#4971B5, #AEC6FF)" },
      "variant:success": { "--color-success": "light-dark(#5F9E78, #9FE59B)" },
      "variant:warning": { "--color-warning": "light-dark(#C7924A, #FDCF4F)" },
      "variant:error": { "--color-error": "light-dark(#C56A6A, #FFC6C1)" },
    },
    banner: {
      "status:info": {
        backgroundColor: "var(--color-background-blue)",
        "--color-accent-muted": "transparent",
        "--color-text-primary": "var(--color-text-blue)",
        "--color-text-secondary": "var(--color-text-blue)",
        "--color-accent": "var(--color-text-blue)",
      },
    },
  },
});
