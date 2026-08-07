import { Suspense, useState, useTransition } from "react";
import type { StaticActivityComponentType } from "@stackflow/react";
import { useGoBack } from "../../hooks/useGoBack";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Text } from "@astryxdesign/core/Text";
import { getBaseYearMonth } from "../../utils/date";
import AnalyzeContent from "./analyze-content";

/** month을 ±1 이동. 1↔12 경계를 넘으면 year도 함께 조정한다. */
function shiftMonth(
  { year, month }: { year: number; month: number },
  delta: number,
) {
  const zeroBased = month - 1 + delta;
  return {
    year: year + Math.floor(zeroBased / 12),
    month: (((zeroBased % 12) + 12) % 12) + 1,
  };
}

const AnalyzeActivity: StaticActivityComponentType<"Analyze"> = () => {
  const goBack = useGoBack();
  const [period, setPeriod] = useState(getBaseYearMonth());
  const [, startTransition] = useTransition();

  const goMonth = (delta: number) =>
    startTransition(() => setPeriod((p) => shiftMonth(p, delta)));

  return (
    <AppScreen>
      <VStack minHeight="100%">
        <HStack paddingInline={2} paddingBlock={2} align="center">
          <IconButton
            label="뒤로 가기"
            icon={<Icon icon="chevronLeft" />}
            variant="ghost"
            onClick={goBack}
          />
          <Text type="body" weight="bold" className="flex-1 text-center">
            소비 분석
          </Text>
          {/* 좌측 뒤로가기 버튼과 같은 폭(32px)을 차지해 타이틀을 정확히 가운데 둔다. */}
          <VStack className="w-8 shrink-0" />
        </HStack>

        {/* 월 이동 바 */}
        <HStack paddingBlock={2} gap={2} align="center" justify="center">
          <IconButton
            label="이전 달"
            icon={<Icon icon="chevronLeft" size="sm" />}
            variant="ghost"
            onClick={() => goMonth(-1)}
          />
          <Text type="body" weight="bold" className="w-16 text-center">
            {period.month}월
          </Text>
          <IconButton
            label="다음 달"
            icon={<Icon icon="chevronRight" size="sm" />}
            variant="ghost"
            onClick={() => goMonth(+1)}
          />
        </HStack>

        <Suspense>
          <AnalyzeContent year={period.year} month={period.month} />
        </Suspense>
      </VStack>
    </AppScreen>
  );
};

export default AnalyzeActivity;
