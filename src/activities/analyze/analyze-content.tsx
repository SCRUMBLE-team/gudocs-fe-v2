import { List, ListItem } from "@astryxdesign/core";
import { Icon } from "@astryxdesign/core/Icon";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { useState } from "react";
import EmptyState from "../../components/empty-state";
import ServiceLogo from "../../components/service-logo";
import { CATEGORY_META } from "../../constants/category";
import { PIE_PALETTE, REST_COLOR } from "../../constants/category-palette";
import { useCategoryExpensesQuery } from "../../hooks/query/useCategoryExpensesQuery";
import { useMonthlyExpenseDetailQuery } from "../../hooks/query/useMonthlyExpensesDetailsQuery";
import type {
  CategoryExpenseData,
  MonthlyDetailData,
} from "../../types/expenses";
import type { SubscribeCategory } from "../../types/subscribe";
import { formatWon } from "../../utils/format";
import { useFlow } from "@stackflow/react";

const TOP_COUNT = 5;
const TOP_SERVICE_COUNT = 3;

type Segment = {
  key: string;
  name: string;
  emoji: string;
  amount: number;
  fill: string;
  /** 이 세그먼트가 품고 있는 카테고리 코드. "그 외"는 여러 개를 합친 것이라 배열이다. */
  categories: SubscribeCategory[];
};

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
    categories: [c.category],
  }));

  if (rest.length > 0) {
    segments.push({
      key: "ETC_REST",
      name: `그 외 ${rest.length}개`,
      // 다른 항목은 전부 아이콘을 달고 있어서 여기만 비면 줄이 어긋나 보인다.
      emoji: CATEGORY_META.ETC.emoji,
      amount: rest.reduce((sum, c) => sum + c.amount, 0),
      fill: REST_COLOR,
      categories: rest.map((c) => c.category),
    });
  }

  return segments;
}

/** 카테고리에 묶인 구독들. 아코디언을 펼쳤을 때 보여준다. */
function servicesOf(
  subscriptions: MonthlyDetailData["subscriptions"],
  categories: SubscribeCategory[],
) {
  return subscriptions
    .filter((s) => !s.deleted && categories.includes(s.category))
    .sort((a, b) => b.appliedMonthlyAmount - a.appliedMonthlyAmount);
}

function AnalyzeContent({ year, month }: { year: number; month: number }) {
  const { data } = useCategoryExpensesQuery({ year, month });
  const { data: detail } = useMonthlyExpenseDetailQuery({ year, month });
  const { push } = useFlow();
  const segments = buildSegments(data.categories);

  // 펼쳐진 세그먼트. 한 번에 하나만 열리도록 배열이 아니라 단일 값으로 둔다.
  const [openKey, setOpenKey] = useState<string | null>(null);
  // 데스크톱에서 막대에 올렸을 때의 미리보기. 저장하지 않고 openKey를 덮기만 한다.
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

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
      <VStack padding={4} paddingBlock={8}>
        <EmptyState message={"이 달은\n지출 내역이 없어요"} />
      </VStack>
    );
  }

  const topCategory = segments[0];
  const toggle = (key: string) =>
    setOpenKey((prev) => (prev === key ? null : key));

  const focusedKey = hoveredKey ?? openKey;
  const focusedSegment = segments.find((seg) => seg.key === focusedKey) ?? null;

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

      {/*
        비율 막대.

        폭을 퍼센트로 주면 반올림 오차가 쌓여 오른쪽 끝에 빈틈이 남는다(그래서
        둥근 끝이 잘린 것처럼 보였다). flex-grow로 나눠 가지면 합이 항상 정확히
        컨테이너를 채우고, 바깥의 rounded-full이 양끝을 깔끔하게 마감한다.
      */}
      <HStack
        className="overflow-hidden rounded-full"
        height={12}
        gap={0.5}
        align="stretch"
      >
        {segments.map((seg) => (
          <VStack
            key={seg.key}
            as="button"
            aria-label={`${seg.name} ${formatWon(seg.amount)}, 전체의 ${toPercent(seg.amount)}퍼센트`}
            aria-expanded={openKey === seg.key}
            onClick={() => toggle(seg.key)}
            onMouseEnter={() => setHoveredKey(seg.key)}
            onMouseLeave={() => setHoveredKey(null)}
            className="min-w-1 transition-opacity hover:opacity-80"
            style={{
              flexGrow: seg.amount,
              flexBasis: 0,
              backgroundColor: seg.fill,
            }}
          />
        ))}
      </HStack>

      {/*
        막대에 올리거나 고른 항목의 금액·비율.
        Stack에는 title prop이 없어 네이티브 툴팁을 못 쓴다. 어차피 모바일에는
        hover가 없어서, 탭으로 고른 것도 같은 자리에 보여준다.
        높이를 비워두면 문구가 나타날 때 아래가 밀리므로 한 줄을 늘 차지하게 둔다.
      */}
      <Text type="supporting" color="secondary" className="min-h-5">
        {focusedSegment
          ? `${focusedSegment.emoji} ${focusedSegment.name} · ${formatWon(focusedSegment.amount)} · ${toPercent(focusedSegment.amount)}%`
          : "막대나 카테고리를 누르면 구독 목록이 열려요"}
      </Text>

      <VStack gap={3}>
        {segments.map((seg) => {
          const isOpen = openKey === seg.key;
          const services = isOpen
            ? servicesOf(detail.subscriptions, seg.categories)
            : [];

          return (
            <VStack key={seg.key} gap={2}>
              <HStack
                as="button"
                justify="between"
                align="center"
                aria-expanded={isOpen}
                onClick={() => toggle(seg.key)}
                onMouseEnter={() => setHoveredKey(seg.key)}
                onMouseLeave={() => setHoveredKey(null)}
                className="w-full"
              >
                {/*
                  카테고리 줄은 펼쳐지는 구독 목록의 머리말이라 목록(15px)보다 커야
                  계층이 보인다. 다만 타입 스케일이 15px 다음 바로 19px이라 한 칸
                  올리면 과하게 커진다. 그 사이가 없어서 17px을 직접 지정했다.
                  (이모지도 글자 크기를 따라가므로 같이 커진다.)
                */}
                <HStack gap={2} align="center">
                  <VStack
                    className="shrink-0 rounded-full"
                    width={12}
                    height={12}
                    style={{ backgroundColor: seg.fill }}
                  />
                  <Text className="text-[17px]" weight="bold">
                    {seg.emoji} {seg.name}
                  </Text>
                  <Icon
                    icon={isOpen ? "chevronDown" : "chevronRight"}
                    size="sm"
                    color="tertiary"
                  />
                </HStack>
                <Text className="text-[17px]" weight="bold">
                  {formatWon(seg.amount)}
                </Text>
              </HStack>

              {isOpen && services.length > 0 && (
                // 카테고리 줄과 들여쓰기가 같으면 같은 계층으로 읽힌다.
                // 색 점(10px) + 간격(8px)만큼 밀어 카테고리 이름 아래로 정렬한다.
                <List className="ps-5">
                  {services.map((service) => (
                    <ListItem
                      key={service.subscriptionId}
                      className="p-0 py-1"
                      onClick={() =>
                        push("SubscribeDetail", {
                          id: String(service.subscriptionId),
                        })
                      }
                      startContent={
                        <ServiceLogo
                          name={service.serviceName}
                          code={service.serviceCode}
                          size={28}
                        />
                      }
                      label={
                        <Text type="body" weight="semibold">
                          {service.serviceName}
                        </Text>
                      }
                      endContent={
                        <Text type="body" weight="semibold">
                          {formatWon(service.appliedMonthlyAmount)}
                        </Text>
                      }
                    />
                  ))}
                </List>
              )}
            </VStack>
          );
        })}
      </VStack>

      {topServices.length > 0 && (
        // 카테고리 목록과 성격이 다른 구획이라 바깥 gap(20px)보다 조금 더 띄운다.
        <VStack gap={2} className="mt-2">
          <Text type="large" weight="bold">
            가장 지출이 큰 서비스 TOP 3
          </Text>
          <List>
            {topServices.map((service, i) => {
              const isFirst = i === 0;
              return (
                <ListItem
                  onClick={() =>
                    push("SubscribeDetail", {
                      id: String(service.subscriptionId),
                    })
                  }
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
                      <ServiceLogo
                        name={service.serviceName}
                        code={service.serviceCode}
                        size={36}
                      />
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
