import {
  BottomSheet,
  Wheel,
  useFontScaleCondition,
  useUserAgent,
} from "@toss/tds-mobile";
import { useEffect, useRef, useState } from "react";

/**
 * TDS `WheelDateSheet`를 대체하는 년/월/일 휠 바텀시트.
 *
 * TDS 쪽은 내부 `BottomSheet`에 `portalContainer`를 넘겨주지 않아 시트가 항상
 * `document.body`로 portal된다. 그러면 `#app-root`(max-w-120 + contain:layout)를
 * 벗어나 `position:fixed`가 뷰포트 기준으로 풀리고, 시트 폭이 뷰포트 전체가 된다.
 *
 * 여기서는 `BottomSheet`를 직접 조립해 `portalContainer`를 열어둔다. 시트를
 * `#app-root` 안으로 portal하면 `contain:layout`이 containing block이 되어
 * CSS 오버라이드 없이 프레임 폭(480px)에 맞는다.
 *
 * 년/월/일 옵션 계산은 TDS 원본 구현을 따랐다.
 */

/** 휠이 도는 도중 옵션이 바뀌면 튀기 때문에, 회전이 멎은 뒤에 다시 계산한다. */
const RECALC_DELAY = 500;

const DEFAULT_YEAR_SPAN = 100;

/** [start, end) */
function range(start: number, end: number) {
  return Array.from({ length: Math.max(0, end - start) }, (_, i) => start + i);
}

/** month는 0-based */
function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/** new Date(2026, 1, 31)이 3월로 넘어가는 것처럼 존재하지 않는 날짜인지 */
function isRealDate(year: number, month: number, day: number) {
  const date = new Date(year, month, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  );
}

function addYears(date: Date, years: number) {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + years);
  return next;
}

function clamp(date: Date, min: Date, max: Date) {
  if (date.getTime() < min.getTime()) return min;
  if (date.getTime() > max.getTime()) return max;
  return date;
}

/** 해당 연도에서 고를 수 있는 월 (1-based) */
function getMonthOptions(year: number, min: Date, max: Date) {
  return range(
    year === min.getFullYear() ? min.getMonth() + 1 : 1,
    year === max.getFullYear() ? max.getMonth() + 2 : 13,
  );
}

/** 해당 연/월에서 고를 수 있는 일 */
function getDayOptions(year: number, month: number, min: Date, max: Date) {
  const first =
    year === min.getFullYear() && month === min.getMonth() ? min.getDate() : 1;
  const last =
    year === max.getFullYear() && month === max.getMonth()
      ? max.getDate()
      : daysInMonth(year, month);
  return range(first, last + 1);
}

export type DateWheelSheetProps = {
  open: boolean;
  title: string;
  description?: string;
  /** @default '적용' */
  buttonText?: string;
  /** @default new Date() */
  initialDate?: Date;
  /** @default initialDate - 100년 */
  min?: Date;
  /** @default initialDate + 100년 */
  max?: Date;
  /** 휠을 돌릴 때마다 호출된다 */
  onWheel?: () => void;
  /** '적용'을 눌렀을 때. min/max로 clamp된 날짜가 넘어온다. */
  onChange: (value: Date) => void;
  onClose: () => void;
  /**
   * 시트를 렌더링할 DOM 요소. `contain`/`transform`이 걸린 요소를 넘기면
   * 시트가 그 요소 안에 갇힌다.
   * @default document.body
   */
  portalContainer?: HTMLElement | null;
};

function DateWheelSheet({
  open,
  title,
  description,
  buttonText = "적용",
  initialDate,
  min,
  max,
  onWheel,
  onChange,
  onClose,
  portalContainer,
}: DateWheelSheetProps) {
  const [base] = useState(() => initialDate ?? new Date());
  const [minDate] = useState(() => min ?? addYears(base, -DEFAULT_YEAR_SPAN));
  const [maxDate] = useState(() => max ?? addYears(base, DEFAULT_YEAR_SPAN));

  const { fontScale = 100 } = useUserAgent();
  const isLargeFont = useFontScaleCondition({ biggerThan: 135 });

  const yearOptions = range(minDate.getFullYear(), maxDate.getFullYear() + 1);

  const [options, setOptions] = useState(() => ({
    month: getMonthOptions(base.getFullYear(), minDate, maxDate),
    day: getDayOptions(base.getFullYear(), base.getMonth(), minDate, maxDate),
  }));

  /**
   * Wheel은 비제어 컴포넌트라 `initialIndex`로만 위치를 잡는다.
   * 옵션 배열이 바뀔 때 인덱스도 같이 맞춰줘야 엉뚱한 값을 가리키지 않는다.
   */
  const [index, setIndex] = useState(() => ({
    year: yearOptions.indexOf(base.getFullYear()),
    month: options.month.indexOf(base.getMonth() + 1),
    day: options.day.indexOf(base.getDate()),
  }));

  /**
   * 휠의 현재 값. 디바운스된 재계산이 최신 값을 읽어야 하는데 state는
   * 클로저에 갇히므로 ref로 들고 간다. (쓰기는 이벤트 핸들러에서만 한다)
   */
  const current = useRef({
    year: base.getFullYear(),
    month: base.getMonth(),
    day: base.getDate(),
  });

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (timer.current != null) clearTimeout(timer.current);
    };
  }, []);

  function scheduleRecalc(recalc: () => void) {
    if (timer.current != null) clearTimeout(timer.current);
    timer.current = setTimeout(recalc, RECALC_DELAY);
  }

  /** 값이 새 옵션에 없으면 경계로 스냅시키고, ref도 같이 맞춘다. */
  function resolve(nextOptions: number[], value: number) {
    const found = nextOptions.indexOf(value);
    const idx = found !== -1 ? found : nextOptions.length - 1;
    return { idx, value: nextOptions[idx] };
  }

  function handleYearChange(year: number) {
    onWheel?.();
    current.current.year = year;
    scheduleRecalc(() => {
      const { year: y, month, day } = current.current;
      const monthOptions = getMonthOptions(y, minDate, maxDate);
      const nextMonth = resolve(monthOptions, month + 1);
      current.current.month = nextMonth.value - 1;

      const dayOptions = getDayOptions(y, current.current.month, minDate, maxDate);
      const nextDay = resolve(dayOptions, day);
      current.current.day = nextDay.value;

      setOptions({ month: monthOptions, day: dayOptions });
      setIndex((prev) => ({
        ...prev,
        month: nextMonth.idx,
        day: nextDay.idx,
      }));
    });
  }

  function handleMonthChange(month: number) {
    onWheel?.();
    current.current.month = month - 1;
    scheduleRecalc(() => {
      const { year, month: m, day } = current.current;
      const dayOptions = getDayOptions(year, m, minDate, maxDate);
      const nextDay = resolve(dayOptions, day);
      current.current.day = nextDay.value;

      setOptions((prev) => ({ ...prev, day: dayOptions }));
      setIndex((prev) => ({ ...prev, day: nextDay.idx }));
    });
  }

  function handleDayChange(day: number) {
    onWheel?.();
    current.current.day = day;
  }

  function handleApply() {
    const { year, month, day } = current.current;
    // 2월 31일처럼 없는 날짜면 그 달의 마지막 날로 되돌린다.
    const picked = isRealDate(year, month, day)
      ? new Date(year, month, day)
      : new Date(year, month, daysInMonth(year, month));
    onChange(clamp(picked, minDate, maxDate));
    onClose();
  }

  const yearWidth = isLargeFont ? "100%" : fontScale - 30;
  const restWidth = isLargeFont ? "100%" : fontScale - 50;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      portalContainer={portalContainer}
      disableChildrenDragging
      header={<BottomSheet.Header>{title}</BottomSheet.Header>}
      headerDescription={
        description ? (
          <BottomSheet.HeaderDescription>
            {description}
          </BottomSheet.HeaderDescription>
        ) : undefined
      }
      cta={<BottomSheet.CTA onTap={handleApply}>{buttonText}</BottomSheet.CTA>}
    >
      <div className="flex h-60 justify-center">
        <Wheel
          aria-label="년도 선택"
          options={yearOptions}
          initialIndex={index.year}
          formatValue={(value) => `${value}년`}
          perspective="right"
          width={yearWidth}
          onChange={handleYearChange}
        />
        <Wheel
          aria-label="월 선택"
          options={options.month}
          initialIndex={index.month}
          formatValue={(value) => `${value}월`}
          width={restWidth}
          onChange={handleMonthChange}
        />
        <Wheel
          aria-label="일 선택"
          options={options.day}
          initialIndex={index.day}
          formatValue={(value) => `${value}일`}
          perspective="left"
          width={restWidth}
          onChange={handleDayChange}
        />
      </div>
    </BottomSheet>
  );
}

export default DateWheelSheet;
