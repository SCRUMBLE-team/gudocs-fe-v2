import { List, ListItem } from "@astryxdesign/core";
import { Badge } from "@astryxdesign/core/Badge";
import { CheckboxInput } from "@astryxdesign/core/CheckboxInput";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { useToast } from "@astryxdesign/core/Toast";
import { useMemo, useState } from "react";
import ServiceLogo from "../../components/service-logo";
import { useMonthlyExpenseDetailQuery } from "../../hooks/query/useMonthlyExpensesDetailsQuery";
import { useSavingsSelectionMutation } from "../../hooks/query/useSavingsSelectionMutation";
import { useCountUp } from "../../hooks/useCountUp";
import { getBaseYearMonth } from "../../utils/date";
import { formatWon } from "../../utils/format";
import {
  buildSavingsRows,
  summarizeSavings,
  type SavingsSummary,
} from "../../utils/savings";
import EmptySubscription from "../home/empty-subscription";
import FixedBottomCTA from "../../components/fixed-bottom-cta";

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
  pausedCount,
}: {
  summary: SavingsSummary;
  selectedCount: number;
  /** 계산에서 빠진 일시정지 구독 수. 0이면 안내를 띄우지 않는다. */
  pausedCount: number;
}) {
  const { baseAmount, savedAmount, remainingAmount, yearlySavedAmount } =
    summary;
  // 이 화면의 주인공은 "얼마나 아끼는가"다. 체크할 때마다 이 숫자가 올라간다.
  const displayAmount = useCountUp(savedAmount);
  const hasSelection = selectedCount > 0;

  return (
    <VStack
      className="sticky top-0 z-10 bg-surface"
      paddingInline={4}
      paddingBlock={4}
      gap={3}
    >
      <VStack gap={1}>
        {/* 타입 스케일이 12px 다음 바로 15px이라 그 사이가 없어 14px을 직접 지정한다. */}
        <Text type="supporting" color="secondary" className="text-[14px]">
          정리하면 매달 이만큼 아껴요
        </Text>

        <Text
          type="display-3"
          weight="bold"
          hasTabularNumbers
          className={hasSelection ? "text-(--color-accent)" : undefined}
        >
          {formatWon(displayAmount)}
        </Text>

        {hasSelection ? (
          <Text type="body" color="secondary">
            1년이면{" "}
            <Text type="body" weight="bold" color="primary">
              {formatWon(yearlySavedAmount)}
            </Text>
          </Text>
        ) : (
          <Text type="body" color="secondary">
            정리해볼 구독을 눌러보세요
          </Text>
        )}
      </VStack>

      <VStack gap={0.5}>
        <HStack justify="between" align="center">
          <Text type="supporting" color="secondary">
            매달 나가는 구독료
          </Text>
          <HStack gap={1.5} align="center">
            {hasSelection && (
              <Text
                type="body"
                color="secondary"
                hasStrikethrough
                hasTabularNumbers
              >
                {formatWon(baseAmount)}
              </Text>
            )}
            <Text type="body" weight="bold" hasTabularNumbers>
              {formatWon(hasSelection ? remainingAmount : baseAmount)}
            </Text>
          </HStack>
        </HStack>
        {pausedCount > 0 && (
          <Text type="supporting" color="secondary">
            일시정지한 {pausedCount}개는 빼고 계산했어요
          </Text>
        )}
      </VStack>

      <SavingsBar {...summary} />
    </VStack>
  );
}

function SavingsContent() {
  const { data } = useMonthlyExpenseDetailQuery(getBaseYearMonth());
  const showToast = useToast();
  const savingsSelect = useSavingsSelectionMutation();
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

  async function handleSubmit() {
    try {
      await savingsSelect.mutateAsync({ subscriptionIds: [...selectedIds] });
      showToast({ body: "알림을 설정했어요" });
    } catch {
      showToast({
        body: "설정에 실패했어요. 잠시 후 다시 시도해주세요.",
        type: "error",
        isAutoHide: true,
        autoHideDuration: 3000,
      });
    }
  }

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
        pausedCount={rows.filter((row) => row.isPaused).length}
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
                    {/*
                      체크박스는 상태를 보여주기만 하고, 실제 토글은 행(ListItem)이
                      맡는다. 그런데 체크박스가 label로 감싸여 있어서 여기를 누르면
                      label 클릭과 input 클릭이 둘 다 행까지 올라간다. 토글이 두 번
                      돌아 제자리로 오니 "체크박스만 안 눌리는" 것처럼 보였다.
                      클릭을 아예 받지 않게 해서 행 하나만 처리하게 한다.
                    */}
                    <CheckboxInput
                      label={`${row.serviceName} 정리 대상으로 선택`}
                      isLabelHidden
                      isReadOnly
                      isDisabled={row.isPaused}
                      value={isChecked}
                      size="sm"
                      className="pointer-events-none"
                    />
                    <ServiceLogo
                      name={row.serviceName}
                      code={row.serviceCode}
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
      {selectedIds.size > 0 && (
        <FixedBottomCTA
          label="안 쓰는 구독 알림 받기"
          onClick={() => void handleSubmit()}
          isDisabled={savingsSelect.isPending}
        />
      )}
    </VStack>
  );
}

export default SavingsContent;
