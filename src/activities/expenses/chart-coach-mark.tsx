type ChartCoachMarkProps = {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  value?: unknown;
  parentViewBox?: unknown;
  onDismiss: () => void;
};

const TOOLTIP_WIDTH = 128;
const TOOLTIP_HEIGHT = 32;

function getCartesianBounds(viewBox: unknown) {
  if (typeof viewBox !== "object" || viewBox === null) return null;

  const { x, width } = viewBox as { x?: unknown; width?: unknown };
  return typeof x === "number" && typeof width === "number"
    ? { x, width }
    : null;
}

/** 선택된 월의 실제 막대 좌표를 기준으로 표시하는 작은 차트 안내. */
function ChartCoachMark({
  x,
  y,
  width,
  value,
  parentViewBox,
  onDismiss,
}: ChartCoachMarkProps) {
  if (!value) return null;

  const barX = Number(x);
  const barY = Number(y);
  const barWidth = Number(width);
  if (![barX, barY, barWidth].every(Number.isFinite)) return null;

  const barCenter = barX + barWidth / 2;
  const chartBounds = getCartesianBounds(parentViewBox);
  const chartLeft = chartBounds?.x ?? 0;
  const chartRight = chartLeft + (chartBounds?.width ?? TOOLTIP_WIDTH);
  const tooltipX = Math.min(
    Math.max(barCenter - TOOLTIP_WIDTH / 2, chartLeft),
    chartRight - TOOLTIP_WIDTH,
  );
  const tooltipY = barY - TOOLTIP_HEIGHT - 20;
  const pointerX = Math.min(
    Math.max(barCenter, tooltipX + 8),
    tooltipX + TOOLTIP_WIDTH - 8,
  );

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label="안내 닫기"
      className="cursor-pointer"
      onClick={onDismiss}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onDismiss();
      }}
    >
      <rect
        x={tooltipX}
        y={tooltipY}
        width={TOOLTIP_WIDTH}
        height={TOOLTIP_HEIGHT}
        rx={8}
        fill="var(--color-accent)"
      />
      <path
        d={`M ${pointerX - 5} ${tooltipY + TOOLTIP_HEIGHT} L ${pointerX} ${tooltipY + TOOLTIP_HEIGHT + 5} L ${pointerX + 5} ${tooltipY + TOOLTIP_HEIGHT} Z`}
        fill="var(--color-accent)"
      />
      <text
        x={tooltipX + TOOLTIP_WIDTH / 2}
        y={tooltipY + TOOLTIP_HEIGHT / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--color-on-accent)"
        fontSize={11}
        fontWeight={600}
      >
        탭해서 월별 상세보기
      </text>
    </g>
  );
}

export default ChartCoachMark;
