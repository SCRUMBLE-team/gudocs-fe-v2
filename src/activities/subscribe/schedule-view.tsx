import { Calendar } from "@astryxdesign/core/Calendar";
import type { ISODateString } from "@astryxdesign/core/Calendar";
import { VStack } from "@astryxdesign/core/VStack";
import { useMemo, useState, useTransition } from "react";
import { useMonthlyExpenseDetailQuery } from "../../hooks/query/useMonthlyExpensesDetailsQuery";
import { toYearMonth } from "../../utils/date";
import { anchorDayOf, hasAmountIn } from "../../utils/expenses";
import MonthlyExpensePanel from "./monthly-expense-panel";

const today = new Date().toISOString().slice(0, 10) as ISODateString;

function ScheduleView() {
  const [focusDate, setFocusDate] = useState<ISODateString>(today);
  const [selectedDate, setSelectedDate] = useState<ISODateString | undefined>();
  const [isPending, startTransition] = useTransition();

  const { year, month } = toYearMonth(focusDate);
  const {
    data: { subscriptions },
  } = useMonthlyExpenseDetailQuery({ year, month });

  /*
   * 그 달에 나가는 돈이 없는 항목은 결제 일정이 아니다.
   *
   * 상세 응답에는 그 달에 청구가 하나도 없던 구독도 0원 행으로 담긴다(정지된
   * 달). 달력에 찍을 날짜가 없고, 패널의 "결제 예정/완료"에 끼면 나가지도 않은
   * 결제가 목록에 생긴다.
   */
  const billableSubscriptions = useMemo(
    () => subscriptions?.filter(hasAmountIn) ?? [],
    [subscriptions],
  );

  const billableDays = useMemo(
    () => new Set(billableSubscriptions.map(anchorDayOf)),
    [billableSubscriptions],
  );

  // 결제 내역이 있는 날만 선택 가능하도록 제약 (해당 월 + 결제 있는 날)
  const isBillableDay = (date: Date) =>
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    billableDays.has(date.getDate());

  const selectedDay = selectedDate
    ? Number(selectedDate.split("-")[2])
    : undefined;

  // 날을 선택하면 그 날의 결제만, 아니면 이 달 전체
  const visibleSubscriptions =
    selectedDay != null
      ? billableSubscriptions.filter((s) => anchorDayOf(s) === selectedDay)
      : billableSubscriptions;

  return (
    <VStack gap={3} className={isPending ? "opacity-60" : undefined}>
      <Calendar
        mode="single"
        focusDate={focusDate}
        onFocusDateChange={(next) => {
          setSelectedDate(undefined);
          startTransition(() => setFocusDate(next));
        }}
        value={selectedDate}
        onChange={setSelectedDate}
        dateConstraints={[isBillableDay]}
        hasOutsideDays={false}
        className="w-full"
      />
      {/* 결제 완료/예정을 가르려면 일(day)만으로는 부족해 연도까지 넘긴다. */}
      <MonthlyExpensePanel
        subscriptions={visibleSubscriptions}
        year={year}
        month={month}
      />
    </VStack>
  );
}

export default ScheduleView;
