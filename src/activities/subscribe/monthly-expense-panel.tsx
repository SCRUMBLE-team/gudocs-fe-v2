import { List, ListItem, VStack, HStack, Text } from "@astryxdesign/core";
import { useMemo } from "react";
import type { MonthlyDetailData } from "../../types/expenses";
import ServiceLogo from "../../components/service-logo";
import { formatWon } from "../../utils/format";
import { toDayOfMonth } from "../../utils/date";
import { useFlow } from "@stackflow/react";

type Props = {
  subscriptions: MonthlyDetailData["subscriptions"];
  month: number;
};

function MonthlyExpensePanel({ subscriptions, month }: Props) {
  const { push } = useFlow();

  const groupsByDay = useMemo(() => {
    const byDay = new Map<number, typeof subscriptions>();
    for (const item of subscriptions) {
      const day = toDayOfMonth(item.firstBillingDate);
      const list = byDay.get(day) ?? [];
      list.push(item);
      byDay.set(day, list);
    }
    return [...byDay.entries()]
      .sort(([dayA], [dayB]) => dayB - dayA)
      .map(([day, items]) => ({
        day,
        items,
        total: items.reduce((sum, i) => sum + i.appliedMonthlyAmount, 0),
      }));
  }, [subscriptions]);

  if (groupsByDay.length === 0) {
    return (
      <VStack padding={6} align="center">
        <Text type="body" color="secondary">
          예정된 결제가 없어요
        </Text>
      </VStack>
    );
  }

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
            {items?.map((item) => {
              return (
                <ListItem
                  onClick={() => {
                    push("SubscribeDetail", {
                      id: String(item.subscriptionId),
                    });
                  }}
                  startContent={<ServiceLogo name={item.serviceName} />}
                  key={item.subscriptionId}
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
              );
            })}
          </List>
        </VStack>
      ))}
    </VStack>
  );
}

export default MonthlyExpensePanel;
