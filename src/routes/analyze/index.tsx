import { Suspense, useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
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

function AnalyzePage() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState(getBaseYearMonth());
  const [, startTransition] = useTransition();

  const goMonth = (delta: number) =>
    startTransition(() => setPeriod((p) => shiftMonth(p, delta)));

  return (
    <VStack className="flex-1" isScrollable>
      <HStack paddingInline={2} paddingBlock={2} align="center">
        <IconButton
          label="뒤로 가기"
          icon={<Icon icon="chevronLeft" />}
          variant="ghost"
          onClick={() => navigate(-1)}
        />
        <Text type="body" weight="bold" className="flex-1 text-center">
          소비 분석
        </Text>
        {/* 좌측 뒤로가기 버튼과 균형을 맞춰 타이틀을 가운데 정렬하기 위한 스페이서 */}
        <VStack className="w-10 shrink-0" />
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
  );
}

export default AnalyzePage;
