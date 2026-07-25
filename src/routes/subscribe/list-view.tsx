import {
  Badge,
  List,
  ListItem,
  VStack,
  HStack,
  Text,
} from "@astryxdesign/core";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscriptionsQuery } from "../../hooks/query/useSubscriptionsQuery";
import ServiceLogo from "../../components/service-logo";
import { CATEGORY_META } from "../../constants/category";
import { BILLING_CYCLE_META } from "../../constants/paymet";
import { formatWon } from "../../utils/format";
import { billingText } from "../../utils/subscribe";
import type { SubscriptionDetail } from "../../types/subscribe";
import EmptySubscription from "../home/empty-subscription";

function ListView() {
  const navigate = useNavigate();
  const { data: subscriptions } = useSubscriptionsQuery({});

  // 카테고리별로 묶어서 섹션 구성
  const groups = useMemo(() => {
    const byCategory = new Map<
      SubscriptionDetail["category"],
      SubscriptionDetail[]
    >();
    for (const item of subscriptions) {
      const list = byCategory.get(item.category) ?? [];
      list.push(item);
      byCategory.set(item.category, list);
    }
    return [...byCategory.entries()].map(([category, items]) => ({
      category,
      items,
    }));
  }, [subscriptions]);

  if (subscriptions.length === 0) {
    return <EmptySubscription />;
  }

  return (
    <VStack gap={4}>
      {groups.map(({ category, items }) => {
        const meta = CATEGORY_META[category];
        return (
          <VStack key={category} gap={1}>
            <HStack justify="between" align="center" paddingInline={1}>
              <Text type="body" weight="bold">
                {meta.emoji} {meta.label}
              </Text>
              <Text type="supporting" color="secondary">
                {items.length}개
              </Text>
            </HStack>
            <List>
              {items.map((item) => {
                const isPaused = item.status === "PAUSED";
                return (
                  <ListItem
                    key={item.id}
                    className={isPaused ? "opacity-50" : undefined}
                    onClick={() => navigate(`/subscribe/${item.id}`)}
                    startContent={
                      <ServiceLogo
                        name={item.serviceName}
                        fallbackName={item.serviceName}
                      />
                    }
                    label={
                      <HStack gap={1} align="center">
                        <Text type="body" weight="semibold">
                          {item.serviceName}
                        </Text>
                        {isPaused && (
                          <Badge variant="neutral" label="일시정지" />
                        )}
                      </HStack>
                    }
                    description={
                      <Text type="supporting" color="secondary">
                        {BILLING_CYCLE_META[item.billingCycle].label} ·{" "}
                        {billingText(item)}
                      </Text>
                    }
                    endContent={
                      <Text type="body" weight="semibold">
                        {formatWon(item.price)}
                      </Text>
                    }
                  />
                );
              })}
            </List>
          </VStack>
        );
      })}
    </VStack>
  );
}

export default ListView;
