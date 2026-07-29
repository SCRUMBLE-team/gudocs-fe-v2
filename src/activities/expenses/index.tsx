import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@astryxdesign/core/SegmentedControl";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { Suspense, useState, useTransition } from "react";
import { getBaseYearMonth } from "../../utils/date";
import type { AmountBasis } from "../../utils/expenses";
import ActualView from "./actual-view";
import ConvertedView from "./converted-view";

const BASIS_META: Record<AmountBasis, { label: string; hint: string }> = {
  CONVERTED: {
    label: "월 환산",
    hint: "연간 구독을 12개월로 나눠 계산했어요",
  },
  ACTUAL: {
    label: "실제 청구",
    hint: "그 달에 실제로 청구되는 금액이에요",
  },
};

const ExpensesActivity: StaticActivityComponentType<"Expenses"> = () => {
  const { pop } = useFlow();
  // 추이 구간의 기준. 달을 옮겨도 차트가 따라 움직이지 않도록 처음 값을 고정한다.
  const [base] = useState(getBaseYearMonth);
  const [selected, setSelected] = useState(base);
  const [basis, setBasis] = useState<AmountBasis>("CONVERTED");
  const [isPending, startTransition] = useTransition();

  // 기준·달을 바꿀 때 Suspense가 화면을 통째로 비우지 않도록 전환으로 감싼다.
  const change = (apply: () => void) => startTransition(apply);

  return (
    <AppScreen>
      <VStack minHeight="100%">
        <HStack paddingInline={2} paddingBlock={2} align="center">
          <IconButton
            label="뒤로 가기"
            icon={<Icon icon="chevronLeft" />}
            variant="ghost"
            onClick={() => pop()}
          />
          <Text type="body" weight="bold" className="flex-1 text-center">
            지출 상세
          </Text>
          {/* 좌측 뒤로가기 버튼과 균형을 맞춰 타이틀을 가운데 정렬하기 위한 스페이서 */}
          <VStack className="w-10 shrink-0" />
        </HStack>

        <VStack paddingInline={4} paddingBlock={2} gap={2}>
          <SegmentedControl
            label="지출 금액 기준"
            layout="fill"
            value={basis}
            onChange={(value) =>
              change(() => setBasis(value as AmountBasis))
            }
          >
            {(Object.keys(BASIS_META) as AmountBasis[]).map((key) => (
              <SegmentedControlItem
                key={key}
                value={key}
                label={BASIS_META[key].label}
              />
            ))}
          </SegmentedControl>
          <Text type="supporting" color="secondary">
            {BASIS_META[basis].hint}
          </Text>
        </VStack>

        <VStack
          className={isPending ? "opacity-60 transition-opacity" : undefined}
        >
          <Suspense>
            {basis === "CONVERTED" ? (
              <ConvertedView
                base={base}
                selected={selected}
                onSelectMonth={(period) => change(() => setSelected(period))}
              />
            ) : (
              <ActualView
                base={base}
                selected={selected}
                onSelectMonth={(period) => change(() => setSelected(period))}
              />
            )}
          </Suspense>
        </VStack>
      </VStack>
    </AppScreen>
  );
};

export default ExpensesActivity;
