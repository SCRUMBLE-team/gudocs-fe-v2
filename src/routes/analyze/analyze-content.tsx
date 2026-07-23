import { List, ListItem } from "@astryxdesign/core";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import ServiceLogo from "../../components/service-logo";
import { CATEGORY_META } from "../../constants/category";
import { PIE_PALETTE, REST_COLOR } from "../../constants/category-palette";
import { useCategoryExpensesQuery } from "../../hooks/query/useCategoryExpensesQuery";
import { useMonthlyExpenseDetailQuery } from "../../hooks/query/useMonthlyExpensesDetailsQuery";
import type { CategoryExpenseData } from "../../types/expenses";
import { formatWon } from "../../utils/format";

const TOP_COUNT = 5;
const TOP_SERVICE_COUNT = 3;

type Segment = {
  key: string;
  name: string;
  emoji: string;
  amount: number;
  fill: string;
};

/**
 * 카테고리를 금액 내림차순으로 정렬해 상위 N개 + 나머지를 "그 외 M개"로 합산한다.
 * 조각이 잘게 쪼개지지 않게 하고, 홈 소비 분석 카드와 동일한 규칙을 따른다.
 */
function buildSegments(
  categories: CategoryExpenseData["categories"],
): Segment[] {
  const sorted = [...categories].sort((a, b) => b.amount - a.amount);
  const top = sorted.slice(0, TOP_COUNT);
  const rest = sorted.slice(TOP_COUNT);

  const segments: Segment[] = top.map((c, i) => ({
    key: c.category,
    name: c.categoryName,
    emoji: CATEGORY_META[c.category]?.emoji ?? "",
    amount: c.amount,
    fill: PIE_PALETTE[i % PIE_PALETTE.length],
  }));

  if (rest.length > 0) {
    segments.push({
      key: "ETC_REST",
      name: `그 외 ${rest.length}개`,
      emoji: "",
      amount: rest.reduce((sum, c) => sum + c.amount, 0),
      fill: REST_COLOR,
    });
  }

  return segments;
}

function AnalyzeContent({ year, month }: { year: number; month: number }) {
  const { data } = useCategoryExpensesQuery({ year, month });
  const { data: detail } = useMonthlyExpenseDetailQuery({ year, month });

  const segments = buildSegments(data.categories);

  // 지출이 큰 서비스 TOP 3 — 삭제된 구독 제외, 월 환산 금액 내림차순.
  const topServices = detail.subscriptions
    .filter((s) => !s.deleted)
    .sort((a, b) => b.appliedMonthlyAmount - a.appliedMonthlyAmount)
    .slice(0, TOP_SERVICE_COUNT);

  const toPercent = (amount: number) =>
    data.totalAmount ? Math.round((amount / data.totalAmount) * 100) : 0;

  // 지출 내역이 없는 달
  if (segments.length === 0) {
    return (
      <VStack padding={4} paddingBlock={8} align="center">
        <Text type="body" color="secondary">
          이 달은 지출 내역이 없어요
        </Text>
      </VStack>
    );
  }

  const topCategory = segments[0];

  return (
    <VStack padding={4} gap={5}>
      <VStack gap={1}>
        <Text type="supporting" color="secondary">
          소비 분석
        </Text>
        <Text type="large" weight="bold">
          <Text type="large" weight="bold" className="text-(--color-accent)">
            {topCategory.emoji} {topCategory.name}
          </Text>
          에 가장 많은 돈을 썼어요
        </Text>
      </VStack>

      {/* 가로 스택 바 */}
      <HStack
        className="overflow-hidden rounded-full"
        height={12}
        gap={0.5}
        align="stretch"
      >
        {segments.map((seg) => (
          <VStack
            key={seg.key}
            className="shrink-0"
            style={{
              width: `${toPercent(seg.amount)}%`,
              backgroundColor: seg.fill,
            }}
          />
        ))}
      </HStack>

      {/* 카테고리 리스트 */}
      <VStack gap={3}>
        {segments.map((seg) => (
          <HStack key={seg.key} justify="between" align="center">
            <HStack gap={2} align="center">
              <VStack
                className="shrink-0 rounded-full"
                width={10}
                height={10}
                style={{ backgroundColor: seg.fill }}
              />
              <Text type="body" weight="semibold">
                {seg.emoji ? `${seg.emoji} ${seg.name}` : seg.name}
              </Text>
            </HStack>
            <Text type="body" weight="bold">
              {formatWon(seg.amount)}
            </Text>
          </HStack>
        ))}
      </VStack>

      {topServices.length > 0 && (
        <VStack gap={2}>
          <Text type="large" weight="bold">
            가장 지출이 큰 서비스 TOP 3
          </Text>
          <List>
            {topServices.map((service, i) => {
              const isFirst = i === 0;
              return (
                <ListItem
                  key={service.subscriptionId}
                  className="p-0 py-1"
                  startContent={
                    <HStack gap={2} align="center">
                      <Text
                        type="body"
                        weight="bold"
                        color={isFirst ? undefined : "secondary"}
                        className={`w-4 shrink-0 text-center${
                          isFirst ? " text-(--color-accent)" : ""
                        }`}
                      >
                        {i + 1}
                      </Text>
                      <ServiceLogo name={service.serviceName} size={36} />
                    </HStack>
                  }
                  label={
                    <Text type="body" weight="semibold">
                      {service.serviceName}
                    </Text>
                  }
                  description={
                    <Text type="supporting" color="secondary">
                      {service.categoryName}
                    </Text>
                  }
                  endContent={
                    <Text type="body" weight="bold">
                      {formatWon(service.appliedMonthlyAmount)}
                    </Text>
                  }
                />
              );
            })}
          </List>
        </VStack>
      )}
    </VStack>
  );
}

export default AnalyzeContent;
