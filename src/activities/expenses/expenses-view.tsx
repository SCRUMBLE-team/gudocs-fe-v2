import { List, ListItem } from "@astryxdesign/core";
import { Badge } from "@astryxdesign/core/Badge";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { useFlow } from "@stackflow/react";
import { useMemo, useRef, useState } from "react";
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis } from "recharts";
import EmptyState from "../../components/empty-state";
import SpendingComparison from "../../components/spending-comparison";
import ServiceLogo from "../../components/service-logo";
import type { BillingCycle } from "../../types/subscribe";
import { addMonths, compareYearMonth, type YearMonth } from "../../utils/date";
import { formatWon } from "../../utils/format";
import ChartCoachMark from "./chart-coach-mark";
import MonthWindow from "./month-window";
import { useCoachMark } from "./use-coach-mark";

export type ExpenseRow = {
  subscriptionId: number;
  serviceName: string;
  /** 카탈로그 code. 로고 조회 키. 직접 입력한 서비스는 null이다. */
  serviceCode: string | null;
  billingCycle: BillingCycle;
  /** 선택한 기준으로 계산된 이 달 금액. */
  amount: number;
  /** 금액이 왜 이 값인지 설명하는 보조 문구. 월간 구독은 없다. */
  note?: string;
  /** 결제일(일). 일자별 그룹핑에 쓴다. */
  day: number;
  /** 일시정지된 구독. 결제가 나가지 않으므로 흐리게 그리고 합계에서 뺀다. */
  isPaused: boolean;
};

/**
 * 기준(월 환산 / 실제 청구)에 상관없이 화면이 그릴 수 있게 정규화한 모델.
 * 어느 기준을 쓰든 converted-view / actual-view가 이 모양으로 맞춰서 넘긴다.
 */
export type ExpensesViewModel = {
  totalAmount: number;
  /** 실제 현재 달의 지출. 비교 문구는 언제나 이 값을 기준으로 삼는다. */
  currentAmount: number;
  monthlyAmount: number;
  yearlyAmount: number;
  trend: { year: number; month: number; totalAmount: number }[];
  rows: ExpenseRow[];
  /** 구독을 처음 등록한 달. 기간을 과거로 옮길 수 있는 하한이다. */
  earliestMonth: YearMonth | null;
  /**
   * 이번 달을 보고 있을 때 쓸 문구 재료.
   *
   * 비교 문구의 기준이 늘 "이번 달"이라, 이번 달을 고르면 자기 자신과 비교해
   * "이번 달과 동일하게 쓰고 있어요"라는 뜻 없는 문장이 나온다. 기준마다 이 달에
   * 대해 할 수 있는 말이 달라서 재료만 받고 문장은 화면이 만든다.
   *
   * UPCOMING — 실제 청구. 오늘 이후 남은 결제 합계.
   * PREVIOUS — 월 환산. 월 환산액에는 "결제 예정"이 없으니 지난달과 비교한다.
   */
  currentMonthNote:
    | { kind: "UPCOMING"; amount: number }
    | { kind: "PREVIOUS"; amount: number };
};

type Props = {
  model: ExpensesViewModel;
  selected: { year: number; month: number };
  onSelectMonth: (period: { year: number; month: number }) => void;
  /** 차트가 보여주는 6개월 창의 마지막 달. */
  windowEnd: YearMonth;
  /** 실제 현재 달. 창을 미래로 넘기지 못하게 막는 상한이자 비교의 기준이다. */
  current: YearMonth;
  onWindowEndChange: (period: YearMonth) => void;
  /** 연간 구독분에 붙일 이름. 기준에 따라 "연간 환산" / "연간 결제"로 갈린다. */
  yearlyLabel: string;
  /** 실제 청구 기준에서 연간 결제가 없는 달에 띄울 안내. */
  emptyYearlyHint?: string;
};

const MONTHLY_FILL = "var(--color-accent)";
const YEARLY_FILL = "var(--color-accent-muted)";

/** 월간/연간 구성 비율 막대. 두 값 다 직접 라벨링하므로 색만으로 구분하지 않는다. */
function CompositionBar({
  monthlyAmount,
  yearlyAmount,
  yearlyLabel,
  emptyYearlyHint,
}: {
  monthlyAmount: number;
  yearlyAmount: number;
  yearlyLabel: string;
  emptyYearlyHint?: string;
}) {
  const total = monthlyAmount + yearlyAmount;
  if (total === 0) return null;

  const segments = [
    { key: "MONTHLY", name: "월간 구독", amount: monthlyAmount, fill: MONTHLY_FILL },
    { key: "YEARLY", name: yearlyLabel, amount: yearlyAmount, fill: YEARLY_FILL },
  ].filter((segment) => segment.amount > 0);

  return (
    <VStack gap={3}>
      {/* gap으로 세그먼트 사이에 표면색 틈을 둬서 경계가 붙어 보이지 않게 한다. */}
      <HStack
        className="overflow-hidden rounded-full"
        height={12}
        gap={0.5}
        align="stretch"
      >
        {segments.map((segment) => (
          <VStack
            key={segment.key}
            className="shrink-0"
            style={{
              width: `${Math.round((segment.amount / total) * 100)}%`,
              backgroundColor: segment.fill,
            }}
          />
        ))}
      </HStack>

      <VStack gap={2}>
        {segments.map((segment) => (
          <HStack key={segment.key} justify="between" align="center">
            <HStack gap={2} align="center">
              <VStack
                className="shrink-0 rounded-full"
                width={10}
                height={10}
                style={{ backgroundColor: segment.fill }}
              />
              <Text type="body" weight="semibold">
                {segment.name}
              </Text>
            </HStack>
            <Text type="body" weight="bold">
              {formatWon(segment.amount)}
            </Text>
          </HStack>
        ))}
      </VStack>

      {yearlyAmount === 0 && emptyYearlyHint && (
        <Text type="supporting" color="secondary">
          {emptyYearlyHint}
        </Text>
      )}
    </VStack>
  );
}

/**
 * 월별 추이 막대. 막대를 누르면 그 달이 선택된다.
 *
 * 값 라벨은 선택된 달에만 붙인다 — 여섯 개 막대에 전부 숫자를 얹으면 서로 겹치고
 * 어느 달을 보고 있는지도 흐려진다.
 */
function TrendChart({
  trend,
  selected,
  onSelectMonth,
  showCoachMark,
  onDismissCoachMark,
}: Pick<Props, "selected" | "onSelectMonth"> & {
  trend: ExpensesViewModel["trend"];
  showCoachMark: boolean;
  onDismissCoachMark: () => void;
}) {
  const chartData = trend.map(({ year, month, totalAmount }) => {
    const isSelected = year === selected.year && month === selected.month;
    return {
      label: `${month}월`,
      amount: totalAmount,
      valueLabel: isSelected ? formatWon(totalAmount) : "",
      coachMarkLabel: isSelected && showCoachMark ? "coach-mark" : "",
      fill: isSelected ? MONTHLY_FILL : YEARLY_FILL,
    };
  });

  // recharts의 activeTooltipIndex는 문자열로도 올 수 있어 숫자로 맞춰 받는다.
  const selectByIndex = (index: number | string | null | undefined) => {
    const period = index == null ? undefined : trend[Number(index)];
    if (period) onSelectMonth({ year: period.year, month: period.month });
  };

  return (
    <ResponsiveContainer
      width="100%"
      height={200}
      className="[&_.recharts-surface]:!overflow-visible"
    >
      {/* 막대 자체는 얇을 수 있어서 차트에도 클릭을 걸어 열(column) 전체를 탭 영역으로 쓴다. */}
      <BarChart
        data={chartData}
        margin={{ top: 24 }}
        onClick={(state) => selectByIndex(state?.activeTooltipIndex)}
        style={{ cursor: "pointer" }}
      >
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
        />
        <Bar
          dataKey="amount"
          radius={[6, 6, 0, 0]}
          minPointSize={2}
          isAnimationActive={false}
          onClick={(_, index) => selectByIndex(index)}
        >
          <LabelList
            dataKey="valueLabel"
            position="top"
            style={{
              fontSize: 11,
              fontWeight: "bold",
              fill: "var(--color-text-secondary)",
            }}
          />
          <LabelList
            dataKey="coachMarkLabel"
            content={(props) => (
              <ChartCoachMark {...props} onDismiss={onDismissCoachMark} />
            )}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 결제일별로 묶은 구독 목록. 일자 내림차순, 그룹 헤더에 그 날 합계. */
function ExpenseList({ rows, month }: { rows: ExpenseRow[]; month: number }) {
  const { push } = useFlow();

  const groupsByDay = useMemo(() => {
    const byDay = new Map<number, ExpenseRow[]>();
    for (const row of rows) {
      const list = byDay.get(row.day) ?? [];
      list.push(row);
      byDay.set(row.day, list);
    }
    return [...byDay.entries()]
      .sort(([dayA], [dayB]) => dayB - dayA)
      .map(([day, items]) => ({
        day,
        items,
        // 일시정지 구독은 실제로 빠져나가지 않으므로 그 날 합계에서 뺀다.
        total: items
          .filter((item) => !item.isPaused)
          .reduce((sum, item) => sum + item.amount, 0),
      }));
  }, [rows]);

  return (
    <VStack gap={4}>
      {groupsByDay.map(({ day, items, total }) => (
        <VStack key={day} gap={1}>
          <HStack justify="between" align="center" paddingInline={1}>
            <Text type="body" weight="bold">
              {month}월 {day}일
            </Text>
            <Text type="body" weight="bold" color="accent">
              {formatWon(total)}
            </Text>
          </HStack>
          <List>
            {items.map((item) => (
              <ListItem
                key={item.subscriptionId}
                // 흐리게만 두면 색을 못 보는 사용자에게는 신호가 없어서 뱃지를 같이 단다.
                className={item.isPaused ? "opacity-50" : undefined}
                onClick={() =>
                  push("SubscribeDetail", { id: String(item.subscriptionId) })
                }
                startContent={
                  <ServiceLogo name={item.serviceName} code={item.serviceCode} />
                }
                label={
                  <HStack gap={1} align="center">
                    <Text type="body" weight="semibold">
                      {item.serviceName}
                    </Text>
                    {item.billingCycle === "YEARLY" && (
                      <Badge variant="neutral" label="연간" />
                    )}
                    {item.isPaused && (
                      <Badge variant="neutral" label="일시정지" />
                    )}
                  </HStack>
                }
                description={
                  item.note ? (
                    <Text type="supporting" color="secondary">
                      {item.note}
                    </Text>
                  ) : undefined
                }
                endContent={
                  <Text type="body" weight="semibold">
                    {formatWon(item.amount)}
                  </Text>
                }
              />
            ))}
          </List>
        </VStack>
      ))}
    </VStack>
  );
}

/**
 * 실제 청구 기준으로 이번 달을 볼 때의 문구.
 *
 * 이번 달은 아직 진행 중이라, 지나간 결제보다 앞으로 빠져나갈 돈이 궁금하다.
 * 결제일이 오늘 이후인 항목들의 합을 알려준다.
 */
function UpcomingBilling({ amount }: { amount: number }) {
  if (amount === 0) {
    return <Text type="body">이번 달 결제는 모두 끝났어요</Text>;
  }

  return (
    <Text type="body">
      이번 달에{" "}
      <Text type="body" weight="bold" color="accent">
        {formatWon(amount)}
      </Text>{" "}
      더 결제 예정이에요
    </Text>
  );
}

/** 스와이프로 인정할 최소 가로 이동 거리(px). 세로 스크롤과 헷갈리지 않게 둔다. */
const SWIPE_THRESHOLD = 48;

function ExpensesView({
  model,
  selected,
  onSelectMonth,
  windowEnd,
  current,
  onWindowEndChange,
  yearlyLabel,
  emptyYearlyHint,
}: Props) {
  const {
    totalAmount,
    currentAmount,
    monthlyAmount,
    yearlyAmount,
    trend,
    rows,
    earliestMonth,
    currentMonthNote,
  } = model;
  const coachMark = useCoachMark();
  const [pendingSelected, setPendingSelected] = useState<YearMonth | null>(null);

  // 월별 합계는 차트 데이터에 이미 있으므로 API 응답을 기다리지 않고 선택과 금액을
  // 먼저 반영한다. 구성·목록 같은 상세 데이터는 기존 transition 안에서 이어서 바뀐다.
  const displayedSelected = pendingSelected ?? selected;
  const isCurrentMonth = compareYearMonth(displayedSelected, current) === 0;
  const displayedTotalAmount =
    trend.find(
      ({ year, month }) =>
        year === displayedSelected.year && month === displayedSelected.month,
    )?.totalAmount ?? totalAmount;

  // 막대를 누르면 안내를 본 것으로 친다.
  const selectMonth = (period: { year: number; month: number }) => {
    coachMark.dismiss();
    setPendingSelected(period);
    onSelectMonth(period);
  };

  // 기간 창 자체가 바뀔 때는 이전 막대의 낙관적 선택을 남기지 않는다.
  const changeWindow = (period: YearMonth) => {
    setPendingSelected(null);
    onWindowEndChange(period);
  };

  // 가로 스와이프로도 기간을 넘길 수 있게 한다. 화살표만으로는 모바일에서 답답하다.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const handleTouchEnd = (endX: number, endY: number) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;

    const deltaX = endX - start.x;
    const deltaY = endY - start.y;
    // 세로로 긁는 중에 손가락이 옆으로 흔들리는 정도로는 기간이 넘어가면 안 된다.
    // 가로 이동이 임계값을 넘으면서 세로보다 커야 스와이프로 친다.
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    if (Math.abs(deltaX) <= Math.abs(deltaY)) return;

    // 왼쪽으로 밀면 다음(미래) 기간. 현재 달을 넘어서지는 않는다.
    if (deltaX < 0) {
      if (compareYearMonth(windowEnd, current) < 0) {
        changeWindow(addMonths(windowEnd, 1));
      }
      return;
    }

    // 오른쪽으로 밀면 이전 기간. 첫 구독 등록 달보다 앞으로는 못 간다.
    if (earliestMonth && compareYearMonth(windowEnd, earliestMonth) <= 0) return;
    changeWindow(addMonths(windowEnd, -1));
  };

  return (
    <VStack padding={4} gap={6}>
      <VStack gap={1}>
        {/* 지금 보고 있는 달을 또렷하게 — 막대를 옮겨 다니면 여기가 유일한 단서다. */}
        <Text className="text-lg" weight="bold">
          {displayedSelected.month}월 지출
        </Text>
        <Text type="display-3" weight="bold" hasTabularNumbers>
          {formatWon(displayedTotalAmount)}
        </Text>
        {/*
          이번 달을 보고 있으면 "이번 달과 비교"가 성립하지 않는다.
          기준별로 이 달에 대해 할 수 있는 말을 대신 보여준다.
        */}
        {isCurrentMonth ? (
          currentMonthNote.kind === "UPCOMING" ? (
            <UpcomingBilling amount={currentMonthNote.amount} />
          ) : (
            <SpendingComparison
              amount={displayedTotalAmount}
              compared={{ label: "지난달", amount: currentMonthNote.amount }}
            />
          )
        ) : (
          <SpendingComparison
            amount={displayedTotalAmount}
            compared={{ label: "이번 달", amount: currentAmount }}
            isPast={compareYearMonth(displayedSelected, current) < 0}
          />
        )}
      </VStack>

      <VStack gap={2}>
        <MonthWindow
          windowEnd={windowEnd}
          current={current}
          earliest={earliestMonth}
          onWindowEndChange={changeWindow}
        />

        <VStack
          onTouchStart={(event) => {
            const touch = event.touches[0];
            touchStart.current = touch
              ? { x: touch.clientX, y: touch.clientY }
              : null;
          }}
          onTouchEnd={(event) => {
            const touch = event.changedTouches[0];
            if (touch) handleTouchEnd(touch.clientX, touch.clientY);
          }}
        >
          <TrendChart
            trend={trend}
            selected={displayedSelected}
            onSelectMonth={selectMonth}
            showCoachMark={coachMark.isVisible}
            onDismissCoachMark={coachMark.dismiss}
          />
        </VStack>
      </VStack>

      {rows.length === 0 ? (
        <VStack paddingBlock={8}>
          <EmptyState message={"이 달은\n지출 내역이 없어요"} />
        </VStack>
      ) : (
        <>
          <CompositionBar
            monthlyAmount={monthlyAmount}
            yearlyAmount={yearlyAmount}
            yearlyLabel={yearlyLabel}
            emptyYearlyHint={emptyYearlyHint}
          />
          <ExpenseList rows={rows} month={selected.month} />
        </>
      )}
    </VStack>
  );
}

export default ExpensesView;
