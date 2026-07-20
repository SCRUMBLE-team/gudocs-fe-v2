import { BottomSheet, TextField } from "@toss/tds-mobile";
import { useState } from "react";

/**
 * 정해진 보기 중 하나를 고르는 line 필드. 트리거를 누르면 바텀시트가 열린다.
 *
 * 결제 주기/결제 방식은 보기가 2~4개뿐이라 SegmentedControl이 먼저 후보였지만,
 * 이 스텝의 다른 필드(이용요금, 결제일)가 전부 라벨 붙은 line 필드라
 * 알약 모양 세그먼트만 폭도 어긋나고 라벨도 없이 튀었다. 트리거를 같은 line
 * 필드로 맞춰 네 줄이 하나로 읽히게 한다.
 */

/** 시트를 가둘 프레임. App.tsx의 #app-root가 contain:layout을 갖고 있다. */
const FRAME_ID = "app-root";

export type OptionSheetFieldOption<T extends string> = {
  value: T;
  label: string;
};

export type OptionSheetFieldProps<T extends string> = {
  /** 트리거에 항상 노출되는 라벨 겸 시트 제목 */
  label: string;
  placeholder?: string;
  options: readonly OptionSheetFieldOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
};

function OptionSheetField<T extends string>({
  label,
  placeholder,
  options,
  value,
  onChange,
}: OptionSheetFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );

  function handleOpen() {
    // 렌더 중에 찾으면 첫 렌더엔 아직 DOM에 없을 수 있다. 여는 시점엔 확실히 있다.
    setPortalContainer(document.getElementById(FRAME_ID));
    setOpen(true);
  }

  const selected = options.find((option) => option.value === value);

  return (
    <>
      <TextField.Button
        variant="line"
        label={label}
        labelOption="sustain"
        placeholder={placeholder}
        value={selected ? selected.label : ""}
        onClick={handleOpen}
      />
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        portalContainer={portalContainer}
        header={<BottomSheet.Header>{label}</BottomSheet.Header>}
      >
        <BottomSheet.Select
          options={options.map((option) => ({
            name: option.label,
            value: option.value,
          }))}
          value={value ?? undefined}
          onChange={(event) => {
            onChange(event.target.value as T);
            setOpen(false);
          }}
        />
      </BottomSheet>
    </>
  );
}

export default OptionSheetField;
