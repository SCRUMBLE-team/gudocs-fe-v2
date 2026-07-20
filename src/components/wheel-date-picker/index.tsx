import { TextField } from "@toss/tds-mobile";
import { useState } from "react";
import type { ReactNode } from "react";
import DateWheelSheet from "./date-wheel-sheet";

/**
 * 날짜 선택 컴포넌트. 트리거(TextField)와 년/월/일 휠 바텀시트를 묶어둔다.
 *
 * TDS `WheelDatePicker`를 쓰지 않고 직접 조립한 이유는 두 가지다.
 *
 * 1. 라벨 — TDS는 트리거의 `labelOption`을 `'appear'` 기본값 그대로 두고
 *    `placeholder`도 넘기지 않아, 날짜를 고르기 전엔 빈 줄만 보인다.
 * 2. 폭 — TDS 시트는 `portalContainer`를 열어두지 않아 항상 `document.body`로
 *    portal된다. `#app-root` 밖으로 나가면 `position:fixed`가 뷰포트 기준이
 *    되어 시트가 뷰포트 전체 폭을 차지한다. 자세한 건 date-wheel-sheet.tsx 참고.
 */

/** 시트를 가둘 프레임. App.tsx의 #app-root가 contain:layout을 갖고 있다. */
const FRAME_ID = "app-root";

export type WheelDatePickerProps = {
  /** 트리거에 항상 노출되는 라벨 */
  label: string;
  /** BottomSheet 상단 제목 */
  title: string;
  /** 선택된 날짜 */
  value?: Date;
  /** '적용'을 눌렀을 때. min/max로 clamp된 날짜가 넘어온다. */
  onChange: (value: Date) => void;
  /** 값이 없을 때 트리거에 보여줄 문구 */
  placeholder?: string;
  /** BottomSheet 제목 아래 설명 */
  description?: string;
  /** @default '적용' */
  buttonText?: string;
  /**
   * 시트를 처음 열었을 때 휠이 가리킬 날짜. `value`가 있으면 그쪽이 우선.
   * @default new Date()
   */
  initialDate?: Date;
  /** @default initialDate - 100년 */
  min?: Date;
  /** @default initialDate + 100년 */
  max?: Date;
  /** 트리거 아래 도움말 */
  help?: ReactNode;
  /** 트리거 에러 표시 */
  hasError?: boolean;
  /** 트리거에 보여줄 값의 포맷 */
  formatValue?: (value: Date) => string;
};

/** yyyy.MM.dd */
function defaultFormatValue(value: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${value.getFullYear()}.${pad(value.getMonth() + 1)}.${pad(value.getDate())}`;
}

function WheelDatePicker({
  label,
  title,
  value,
  onChange,
  placeholder,
  description,
  buttonText,
  initialDate,
  min,
  max,
  help,
  hasError,
  formatValue = defaultFormatValue,
}: WheelDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  /**
   * 열 때마다 증가시켜 시트를 remount하는 key.
   * 휠은 비제어라 mount 시점의 `initialDate`로만 위치를 잡기 때문에, 이게 없으면
   * 바깥에서 value가 바뀌어도 다음에 열었을 때 예전 위치를 가리킨다.
   * 닫을 때는 key가 그대로라 언마운트되지 않고 닫힘 애니메이션이 살아있다.
   */
  const [openSeq, setOpenSeq] = useState(0);

  function handleOpen() {
    // 렌더 중에 찾으면 첫 렌더엔 아직 DOM에 없을 수 있다. 여는 시점엔 확실히 있다.
    setPortalContainer(document.getElementById(FRAME_ID));
    setOpenSeq((seq) => seq + 1);
    setOpen(true);
  }

  return (
    <>
      <TextField.Button
        variant="line"
        label={label}
        labelOption="sustain"
        placeholder={placeholder}
        help={help}
        hasError={hasError}
        value={value ? formatValue(value) : ""}
        onClick={handleOpen}
      />
      {/* 시트를 열 때마다 value 기준으로 휠을 다시 잡도록 key로 remount한다.
          닫혀 있을 땐 마운트하지 않아 휠 3개의 상태를 들고 있지 않는다. */}
      {open && (
        <DateWheelSheet
          key={value?.getTime() ?? "empty"}
          open={open}
          title={title}
          description={description}
          buttonText={buttonText}
          initialDate={value ?? initialDate}
          min={min}
          max={max}
          portalContainer={portalContainer}
          onClose={() => setOpen(false)}
          onChange={onChange}
        />
      )}
    </>
  );
}

export default WheelDatePicker;
