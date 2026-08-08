import type { SVGProps } from "react";

// Astryx의 Icon은 size/color를 className·style로 내려보내므로,
// 각 아이콘은 받은 props를 반드시 svg에 그대로 펼쳐야 한다.
// (activities/subscribe/new/start/method-icons.tsx와 같은 규칙)
type IconProps = SVGProps<SVGSVGElement>;

/**
 * 카테고리 line 아이콘.
 *
 * CATEGORY_META의 emoji·CDN 아이콘을 쓰지 않는 이유는 그쪽이 전부 색이 박힌
 * 그림이라 등록 첫 화면(start)의 파란 line 아이콘 옆에 두면 결이 어긋나서다.
 * 여기 아이콘들은 stroke만 쓰므로 Icon의 color="accent"가 그대로 먹는다.
 */
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function OttIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="4" width="20" height="14" rx="2" />
      <path d="M10 9.5v3l3-1.5z" />
      <path d="M8 21h8" />
    </svg>
  );
}

export function MusicIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
    </svg>
  );
}

export function CloudIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 18a4.5 4.5 0 0 1-.5-8.97 6 6 0 0 1 11.6 1.55A3.75 3.75 0 0 1 17.5 18z" />
    </svg>
  );
}

export function ProductivityIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="7" width="20" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M2 13h20" />
    </svg>
  );
}

export function AiIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" />
      <path d="M18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8z" />
    </svg>
  );
}

export function NewsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h13v14a2 2 0 0 0 2 2H5a1 1 0 0 1-1-1z" />
      <path d="M17 9h3v10a2 2 0 0 1-2 2" />
      <path d="M7 9h7M7 13h7M7 17h4" />
    </svg>
  );
}

export function EducationIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4 2 9l10 5 10-5z" />
      <path d="M6 11.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" />
    </svg>
  );
}

export function GameIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="7" width="20" height="11" rx="4" />
      <path d="M7 11v3M5.5 12.5h3M15.5 12h.01M18 14h.01" />
    </svg>
  );
}

export function ShoppingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 8h14l-1 12H6z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function DesignIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3a9 9 0 1 0 0 18 2 2 0 0 0 1.6-3.2 2 2 0 0 1 1.6-3.2H18a3 3 0 0 0 3-3 9 9 0 0 0-9-8.6z" />
      <path d="M7.5 12h.01M10 8h.01M14.5 7.5h.01" />
    </svg>
  );
}

export function EtcIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M2 4h20v4H2zM10 12h4" />
    </svg>
  );
}

/** 서비스 이름을 직접 적는 행 */
export function PencilIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20h4L19 9a2.5 2.5 0 0 0-3.5-3.5L4.5 16.5z" />
      <path d="m14.5 6.5 3.5 3.5" />
    </svg>
  );
}
