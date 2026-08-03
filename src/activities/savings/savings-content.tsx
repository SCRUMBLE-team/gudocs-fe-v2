import { List, ListItem } from "@astryxdesign/core";
import { Badge } from "@astryxdesign/core/Badge";
import { CheckboxInput } from "@astryxdesign/core/CheckboxInput";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { useMemo, useState } from "react";
import ServiceLogo from "../../components/service-logo";
import { useMonthlyExpenseDetailQuery } from "../../hooks/query/useMonthlyExpensesDetailsQuery";
import { useCountUp } from "../../hooks/useCountUp";
import { getBaseYearMonth } from "../../utils/date";
import { formatWon } from "../../utils/format";
import {
  buildSavingsRows,
  summarizeSavings,
  type SavingsSummary,
} from "../../utils/savings";
import EmptySubscription from "../home/empty-subscription";

const REMAINING_FILL = "var(--color-accent)";
const SAVED_FILL = "var(--color-accent-muted)";

function SavingsBar({ remainingAmount, savedAmount }: SavingsSummary) {
  const total = remainingAmount + savedAmount;
  if (total === 0) return null;

  const remainingPercent = Math.round((remainingAmount / total) * 100);
  const segments = [
    { key: "REMAINING", percent: remainingPercent, fill: REMAINING_FILL },
    { key: "SAVED", percent: 100 - remainingPercent, fill: SAVED_FILL },
  ];

  const hasBothSides = remainingAmount > 0 && savedAmount > 0;

  return (
    <HStack
      className="overflow-hidden rounded-full"
      height={12}
      gap={hasBothSides ? 0.5 : 0}
      align="stretch"
    >
      {segments.map((segment) => (
        <VStack
          key={segment.key}
          className="shrink-0 transition-[width] duration-(--duration-medium-max) ease-(--ease-standard) motion-reduce:transition-none"
          style={{
            width: `${segment.percent}%`,
            backgroundColor: segment.fill,
          }}
        />
      ))}
    </HStack>
  );
}

/** 스크롤해도 따라오는 금액 요약. 체크할 때마다 숫자가 여기서 줄어든다. */
function SavingsSummaryHeader({
  summary,
  selectedCount,
}: {
  summary: SavingsSummary;
  selectedCount: number;
}) {
  const { savedAmount, remainingAmount, yearlySavedAmount } = summary;
  const displayAmount = useCountUp(remainingAmount);
  const hasSelection = selectedCount > 0;

  return (
    <VStack
      className="sticky top-0 z-10 bg-surface"
      paddingInline={4}
      paddingBlock={4}
      gap={3}
    >
      <VStack gap={1}>
        <HStack justify="between" align="center">
          <Text type="supporting" color="secondary">
            {hasSelection ? "정리하면 이만큼 남아요" : "이번 달 구독료"}
          </Text>
        </HStack>

        <Text type="display-3" weight="bold" hasTabularNumbers>
          {formatWon(displayAmount)}
        </Text>

        {hasSelection ? (
          <Text type="body" weight="semibold">
            <Text type="body" weight="bold" className="text-(--color-accent)">
              월 {formatWon(savedAmount)}
            </Text>
            {" 아껴요 · 1년이면 "}
            {formatWon(yearlySavedAmount)}
          </Text>
        ) : (
          <Text type="body" color="secondary">
            정리해볼 구독을 눌러보세요
          </Text>
        )}
      </VStack>

      <SavingsBar {...summary} />
    </VStack>
  );
}

function SavingsContent() {
  const { data } = useMonthlyExpenseDetailQuery(getBaseYearMonth());
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  );

  const rows = useMemo(
    () => buildSavingsRows(data.subscriptions),
    [data.subscriptions],
  );

  const summary = summarizeSavings(rows, selectedIds);

  const toggle = (subscriptionId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(subscriptionId)) next.delete(subscriptionId);
      else next.add(subscriptionId);
      return next;
    });
  };

  if (rows.length === 0) {
    return (
      <VStack padding={4} paddingBlock={8}>
        <EmptySubscription />
      </VStack>
    );
  }

  return (
    <VStack gap={4}>
      <SavingsSummaryHeader
        summary={summary}
        selectedCount={selectedIds.size}
      />

      <VStack paddingInline={4}>
        <List>
          {rows.map((row) => {
            const isChecked = selectedIds.has(row.subscriptionId);
            return (
              <ListItem
                key={row.subscriptionId}
                isSelected={isChecked}
                isDisabled={row.isPaused}
                className={row.isPaused ? "opacity-50" : undefined}
                onClick={
                  row.isPaused ? undefined : () => toggle(row.subscriptionId)
                }
                startContent={
                  <HStack gap={2} align="center">
                    <CheckboxInput
                      label={`${row.serviceName} 정리 대상으로 선택`}
                      isLabelHidden
                      isReadOnly
                      isDisabled={row.isPaused}
                      value={isChecked}
                      size="sm"
                    />
                    <ServiceLogo
                      name={row.serviceName}
                      fallbackName={row.serviceName}
                    />
                  </HStack>
                }
                label={
                  <HStack gap={1} align="center">
                    <Text type="body" weight="semibold">
                      {row.serviceName}
                    </Text>
                    {row.isPaused && (
                      <Badge variant="neutral" label="일시정지" />
                    )}
                  </HStack>
                }
                description={
                  <Text type="supporting" color="secondary">
                    {row.categoryName}
                  </Text>
                }
                endContent={
                  <Text
                    type="body"
                    weight="semibold"
                    color={isChecked ? "secondary" : undefined}
                    className={isChecked ? "line-through" : undefined}
                  >
                    {formatWon(row.monthlyAmount)}
                  </Text>
                }
              />
            );
          })}
        </List>
      </VStack>

      <VStack paddingInline={4} paddingBlock={4}>
        <Text type="supporting" color="secondary">
          실제 정리는 구독 상세 화면에서 일시정지하거나 삭제할 수 있어요
        </Text>
      </VStack>
    </VStack>
  );
}

export default SavingsContent;
