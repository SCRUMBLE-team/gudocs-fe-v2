import { List, ListItem, VStack, HStack, Text } from "@astryxdesign/core";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@astryxdesign/core/SegmentedControl";
import { useMemo, useState } from "react";
import type { MonthlyDetailData } from "../../types/expenses";
import ServiceLogo from "../../components/service-logo";
import { formatWon } from "../../utils/format";
import { anchorDayOf, hasAmountIn } from "../../utils/expenses";
import { useFlow } from "@stackflow/react";

type Props = {
  subscriptions: MonthlyDetailData["subscriptions"];
  year: number;
  month: number;
};

type Tab = "UPCOMING" | "PAST";

type DayGroup = {
  day: number;
  items: MonthlyDetailData["subscriptions"];
  total: number;
};

/** 연·월·일을 20260807 같은 정수로. 이 형태면 대소 비교가 그대로 날짜 비교가 된다. */
function dateKey(year: number, month: number, day: number) {
  return year * 10_000 + month * 100 + day;
}

function todayKey() {
  const now = new Date();
  return dateKey(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/** 날짜 묶음 하나. 제목 + 그 날 합계 + 구독 목록. */
function DaySection({
  group,
  month,
  isPast,
}: {
  group: DayGroup;
  month: number;
  isPast: boolean;
}) {
  const { push } = useFlow();

  return (
    <VStack gap={1}>
      <HStack justify="between" align="center" paddingInline={1}>
        <Text type="body" weight="bold" color={isPast ? "secondary" : undefined}>
          {month}월 {group.day}일
        </Text>
        <Text
          type="body"
          weight="bold"
          color={isPast ? "secondary" : "accent"}
        >
          {formatWon(group.total)}
        </Text>
      </HStack>
      <List>
        {group.items.map((item) => (
          <ListItem
            key={item.subscriptionId}
            onClick={() =>
              push("SubscribeDetail", { id: String(item.subscriptionId) })
            }
            startContent={
              <ServiceLogo name={item.serviceName} code={item.serviceCode} />
            }
            label={
              <Text type="body" weight="semibold">
                {item.serviceName}
              </Text>
            }
            endContent={
              <Text type="supporting" weight="semibold">
                {formatWon(item.appliedMonthlyAmount)}
              </Text>
            }
          />
        ))}
      </List>
    </VStack>
  );
}

function MonthlyExpensePanel({ subscriptions, year, month }: Props) {
  /*
   * 오늘을 기준으로 "결제 예정"과 "결제 완료"로 가른다.
   *
   * 항목이 들고 있는 건 그 달의 청구일이라 '일(day)'만 꺼내 쓴다. 보고 있는
   * 연·월에 그 일을 붙여 실제 날짜를 만든 뒤 오늘과 견준다. 그래서 지난달을
   * 보면 전부 완료로, 다음 달을 보면 전부 예정으로 떨어진다.
   *
   * 오늘 결제되는 건은 예정에 넣는다. 아직 빠져나가지 않았을 수 있고,
   * 사용자가 확인해야 할 쪽도 이쪽이다.
   */
  const { upcoming, past } = useMemo(() => {
    const byDay = new Map<number, MonthlyDetailData["subscriptions"]>();
    for (const item of subscriptions) {
      // 그 달에 나가는 돈이 없는 항목(정지된 달)은 결제 일정에 자리가 없다.
      // 호출부에서 이미 걸러 넘기지만, 0원 행이 새면 없는 결제가 목록에 생긴다.
      if (!hasAmountIn(item)) continue;
      const day = anchorDayOf(item);
      const list = byDay.get(day) ?? [];
      list.push(item);
      byDay.set(day, list);
    }

    const groups: DayGroup[] = [...byDay.entries()].map(([day, items]) => ({
      day,
      items,
      total: items.reduce((sum, i) => sum + i.appliedMonthlyAmount, 0),
    }));

    const today = todayKey();
    return {
      // 가까운 날짜부터
      upcoming: groups
        .filter((g) => dateKey(year, month, g.day) >= today)
        .sort((a, b) => a.day - b.day),
      // 최근에 결제된 것부터
      past: groups
        .filter((g) => dateKey(year, month, g.day) < today)
        .sort((a, b) => b.day - a.day),
    };
  }, [subscriptions, year, month]);

  /*
   * 고른 탭. 아직 안 골랐으면(null) 데이터를 보고 정한다.
   *
   * 달력에서 지난 날을 선택하면 예정 쪽이 비는데, 기본값을 "예정"으로 못박아두면
   * 빈 화면부터 보게 된다. 반대로 사용자가 직접 고른 뒤에는 비어 있어도 그 탭을
   * 지켜야 해서, 초기값을 계산하지 않고 선택 여부를 따로 들고 있는다.
   *
   * 선택은 그때 보고 있던 달에만 유효하다. 달을 옮기면 상황이 달라지므로
   * (지난달은 전부 완료, 다음 달은 전부 예정) 연·월을 함께 저장해 두고
   * 달이 바뀌면 다시 데이터를 보고 정한다. effect로 초기화하면 이 저장소
   * 린트 규칙에 걸려서 저장한 달과 비교하는 방식으로 푼다.
   */
  const [picked, setPicked] = useState<
    { tab: Tab; year: number; month: number } | null
  >(null);
  const isPickedForThisMonth =
    picked != null && picked.year === year && picked.month === month;
  const tab: Tab = isPickedForThisMonth
    ? picked.tab
    : upcoming.length > 0
      ? "UPCOMING"
      : "PAST";

  const isPast = tab === "PAST";
  const groups = isPast ? past : upcoming;

  return (
    <VStack gap={4}>
      <SegmentedControl
        label="결제 상태"
        layout="fill"
        value={tab}
        onChange={(value) => setPicked({ tab: value as Tab, year, month })}
      >
        <SegmentedControlItem value="UPCOMING" label="결제 예정" />
        <SegmentedControlItem value="PAST" label="결제 완료" />
      </SegmentedControl>

      {groups.length === 0 ? (
        <VStack padding={6} align="center">
          <Text type="body" color="secondary">
            {isPast ? "결제된 내역이 없어요" : "예정된 결제가 없어요"}
          </Text>
        </VStack>
      ) : (
        groups.map((group) => (
          <DaySection
            key={group.day}
            group={group}
            month={month}
            isPast={isPast}
          />
        ))
      )}
    </VStack>
  );
}

export default MonthlyExpensePanel;
