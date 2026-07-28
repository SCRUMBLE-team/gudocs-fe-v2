import type { SVGProps } from "react";

// Astryx의 Icon은 size/color를 className·style로 내려보내므로,
// 각 아이콘은 받은 props를 반드시 svg에 그대로 펼쳐야 한다.
// (activities/home/tab-icons.tsx와 같은 규칙)
type IconProps = SVGProps<SVGSVGElement>;

/** 이미지로 등록하기 */
export function ImageIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M3 16.5 8 12l4 3.5 3-2.5 6 5" strokeLinejoin="round" />
    </svg>
  );
}

/** 직접 입력하기 */
export function PencilIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path
        d="M4 20h4L19 9a2.5 2.5 0 0 0-3.5-3.5L4.5 16.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m14.5 6.5 3.5 3.5" strokeLinecap="round" />
    </svg>
  );
}
