import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { StaticActivityComponentType } from "@stackflow/react";
import { useGoBack } from "../../hooks/useGoBack";
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
import { getBaseYearMonth, type YearMonth } from "../../utils/date";
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
  const goBack = useGoBack();

  // 실제 현재 달. 비교 문구의 기준이자 창을 미래로 못 넘기게 막는 상한이라
  // 화면이 살아 있는 동안 바뀌지 않게 고정한다.
  const [current] = useState(getBaseYearMonth);
  // 차트가 보여주는 6개월 창의 마지막 달. 화살표·스와이프·피커로 옮긴다.
  const [windowEnd, setWindowEnd] = useState(current);
  const [selected, setSelected] = useState(current);
  const [basis, setBasis] = useState<AmountBasis>("CONVERTED");
  const [isPending, startTransition] = useTransition();

  // 기준·달을 바꿀 때 Suspense가 화면을 통째로 비우지 않도록 전환으로 감싼다.
  const change = (apply: () => void) => startTransition(apply);

  /**
   * 창을 옮기면 보고 있던 달도 같이 데려간다.
   * 선택한 달이 창 밖으로 밀려나면 어느 막대가 선택됐는지 알 수 없고,
   * 상단 금액만 창과 무관하게 남아 헷갈린다.
   */
  const changeWindow = (period: YearMonth) =>
    change(() => {
      setWindowEnd(period);
      setSelected(period);
    });

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
            지출 상세
          </Text>
          {/* 좌측 뒤로가기 버튼과 같은 폭(32px)을 차지해 타이틀을 정확히 가운데 둔다. */}
          <VStack className="w-8 shrink-0" />
        </HStack>

        <VStack paddingInline={4} paddingBlock={2} gap={3}>
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
                windowEnd={windowEnd}
                current={current}
                onWindowEndChange={changeWindow}
                selected={selected}
                onSelectMonth={(period) => change(() => setSelected(period))}
              />
            ) : (
              <ActualView
                windowEnd={windowEnd}
                current={current}
                onWindowEndChange={changeWindow}
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
