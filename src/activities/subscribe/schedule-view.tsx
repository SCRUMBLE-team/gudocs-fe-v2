import { Calendar } from "@astryxdesign/core/Calendar";
import type { ISODateString } from "@astryxdesign/core/Calendar";
import { VStack } from "@astryxdesign/core/VStack";
import { useMemo, useState, useTransition } from "react";
import { useMonthlyExpenseDetailQuery } from "../../hooks/query/useMonthlyExpensesDetailsQuery";
import { toDayOfMonth, toYearMonth } from "../../utils/date";
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

  const billableDays = useMemo(
    () => new Set(subscriptions?.map((s) => toDayOfMonth(s.firstBillingDate))),
    [subscriptions],
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
      ? subscriptions?.filter(
          (s) => toDayOfMonth(s.firstBillingDate) === selectedDay,
        )
      : subscriptions;

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
      <MonthlyExpensePanel subscriptions={visibleSubscriptions} month={month} />
    </VStack>
  );
}

export default ScheduleView;
