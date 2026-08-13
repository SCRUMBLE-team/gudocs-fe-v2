/**
 * 랜딩 슬라이드 비주얼에서 공용으로 쓰는 조각들.
 *
 * 실제 데이터가 아니라 제품이 주는 효용만 보여주는 목업이라 쿼리를 붙이지 않는다.
 * 다만 카드 모양·강조 색은 서비스 화면과 같은 토큰(accent, border, surface)을 쓴다.
 * 브랜드 컬러는 theme(gudocs-theme.ts)의 accent(#1F4DF3) 한 곳에서만 관리한다.
 */

/** 서비스 화면과 같은 인상의 흰 카드. 랜딩 목업 전용. */
export function PreviewCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[28px] border border-border bg-surface p-5 shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}

export type PreviewBar = {
  label: string;
  /** 막대 높이 비율(%). 실제 금액이 아니라 눈으로 읽히는 비율만 맞춘다. */
  height: number;
  /** 강조할 달. accent 원색으로 칠한다. */
  isCurrent?: boolean;
};

/**
 * 월별 지출 막대.
 *
 * 홈의 SpendingSummary와 같은 규칙 — 이번 달은 accent 원색, 나머지는 accent-muted.
 * 목업이라 recharts 대신 div로 그린다(랜딩에 차트 런타임까지 태울 이유가 없다).
 */
export function PreviewBars({
  bars,
  hasLabels = false,
  height = 80,
}: {
  bars: PreviewBar[];
  hasLabels?: boolean;
  /** 차트 영역 높이(px). 카드에 다른 정보가 많은 슬라이드는 낮춰 쓴다. */
  height?: number;
}) {
  return (
    <div>
      <div
        className="flex items-end justify-between gap-2 border-b border-border px-1"
        style={{ height }}
      >
        {bars.map((bar) => (
          <div
            key={bar.label}
            className={`w-full rounded-t-md ${
              bar.isCurrent ? "bg-accent" : "bg-accent-muted"
            }`}
            style={{ height: `${bar.height}%` }}
          />
        ))}
      </div>
      {hasLabels && (
        <div className="mt-1.5 flex justify-between gap-2 px-1">
          {bars.map((bar) => (
            <span
              key={bar.label}
              className={`w-full text-center text-[11px] ${
                bar.isCurrent
                  ? "font-bold text-accent"
                  : "font-medium text-secondary"
              }`}
            >
              {bar.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
