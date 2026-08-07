import { useState } from "react";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import BottomSheet from "../../components/bottom-sheet";
import {
  addMonths,
  compareYearMonth,
  formatYearMonth,
  type YearMonth,
} from "../../utils/date";

/** 추이 차트가 한 번에 보여주는 개월 수. utils/expenses의 MAX_TREND_MONTHS와 맞춘다. */
const WINDOW_MONTHS = 6;

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

type Props = {
  /** 창의 마지막 달. 차트는 이 달을 포함해 과거 6개월을 그린다. */
  windowEnd: YearMonth;
  /** 실제 현재 달. 미래로는 못 넘어가게 막는 상한이다. */
  current: YearMonth;
  /** 구독을 처음 등록한 달. 과거로 갈 수 있는 하한이다. 구독이 없으면 null. */
  earliest: YearMonth | null;
  onWindowEndChange: (period: YearMonth) => void;
};

/** 연/월을 바로 고르는 시트. 달력을 통째로 띄울 만큼의 일이 아니라 격자만 둔다. */
function MonthPicker({
  isOpen,
  onOpenChange,
  value,
  current,
  earliest,
  onPick,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  value: YearMonth;
  current: YearMonth;
  earliest: YearMonth | null;
  onPick: (period: YearMonth) => void;
}) {
  // 시트 안에서 넘기는 연도. 실제 선택은 월을 눌러야 확정된다.
  const [year, setYear] = useState(value.year);

  return (
    <BottomSheet
      isOpen={isOpen}
      onOpenChange={(open) => {
        // 다시 열 때 보고 있던 달의 연도에서 시작하도록 되돌린다.
        if (!open) setYear(value.year);
        onOpenChange(open);
      }}
      title="기간 선택"
    >
      <VStack paddingInline={4} paddingBlock={2} gap={3}>
        <HStack justify="between" align="center">
          <IconButton
            label="이전 해"
            icon={<Icon icon="chevronLeft" />}
            variant="ghost"
            isDisabled={earliest != null && year <= earliest.year}
            onClick={() => setYear((prev) => prev - 1)}
          />
          <Text type="large" weight="bold">
            {year}년
          </Text>
          <IconButton
            label="다음 해"
            icon={<Icon icon="chevronRight" />}
            variant="ghost"
            isDisabled={year >= current.year}
            onClick={() => setYear((prev) => prev + 1)}
          />
        </HStack>

        {/* 4열 x 3행. 아직 오지 않은 달은 데이터가 없으므로 막는다. */}
        <div className="grid grid-cols-4 gap-2">
          {MONTHS.map((month) => {
            const period = { year, month };
            // 앞뒤로 데이터가 없는 달은 고를 수 없다.
            const isOutOfRange =
              compareYearMonth(period, current) > 0 ||
              (earliest != null && compareYearMonth(period, earliest) < 0);
            const isSelected =
              year === value.year && month === value.month && !isOutOfRange;

            return (
              <VStack
                key={month}
                as="button"
                align="center"
                paddingBlock={2}
                aria-label={`${year}년 ${month}월`}
                aria-pressed={isSelected}
                // VStack의 타입에 disabled가 없어 aria로 알리고 핸들러에서 막는다.
                aria-disabled={isOutOfRange}
                onClick={() => {
                  if (isOutOfRange) return;
                  onPick(period);
                  onOpenChange(false);
                }}
                className={`rounded-xl transition-colors ${
                  isSelected
                    ? "bg-accent"
                    : isOutOfRange
                      ? "opacity-40"
                      : "bg-surface-raised"
                }`}
              >
                <Text
                  type="body"
                  weight={isSelected ? "bold" : "medium"}
                  className={isSelected ? "text-on-accent" : undefined}
                >
                  {month}월
                </Text>
              </VStack>
            );
          })}
        </div>
      </VStack>
    </BottomSheet>
  );
}

/**
 * 추이 차트가 보는 6개월 창을 한 달씩 옮기는 컨트롤.
 *
 * 창이 현재 달에 고정돼 있으면 그보다 이전 달은 볼 방법이 아예 없었다.
 * 가운데 기간 텍스트를 누르면 연/월을 바로 고를 수 있다.
 */
function MonthWindow({
  windowEnd,
  current,
  earliest,
  onWindowEndChange,
}: Props) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const windowStart = addMonths(windowEnd, -(WINDOW_MONTHS - 1));
  // 미래는 데이터가 없으니 현재 달까지만 앞으로 갈 수 있다.
  const canGoForward = compareYearMonth(windowEnd, current) < 0;
  // 첫 구독 등록 달까지만 뒤로 갈 수 있다. 그보다 앞은 빈 막대뿐이다.
  const canGoBack = earliest == null || compareYearMonth(windowEnd, earliest) > 0;

  return (
    <>
      <HStack justify="between" align="center">
        <IconButton
          label="이전 기간"
          icon={<Icon icon="chevronLeft" />}
          variant="ghost"
          isDisabled={!canGoBack}
          onClick={() => onWindowEndChange(addMonths(windowEnd, -1))}
        />

        <HStack
          as="button"
          gap={1}
          align="center"
          paddingInline={2}
          paddingBlock={1}
          aria-label={`기간 선택, 현재 ${formatYearMonth(windowStart)}부터 ${formatYearMonth(windowEnd)}까지`}
          onClick={() => setIsPickerOpen(true)}
          className="rounded-lg transition-transform active:scale-95"
        >
          <Text type="body" weight="semibold" hasTabularNumbers>
            {formatYearMonth(windowStart)} - {formatYearMonth(windowEnd)}
          </Text>
          <Icon icon="chevronDown" size="sm" color="secondary" />
        </HStack>

        <IconButton
          label="다음 기간"
          icon={<Icon icon="chevronRight" />}
          variant="ghost"
          isDisabled={!canGoForward}
          onClick={() => onWindowEndChange(addMonths(windowEnd, 1))}
        />
      </HStack>

      <MonthPicker
        isOpen={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        value={windowEnd}
        current={current}
        earliest={earliest}
        onPick={onWindowEndChange}
      />
    </>
  );
}

export default MonthWindow;
