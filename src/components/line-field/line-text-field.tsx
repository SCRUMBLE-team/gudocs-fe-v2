import { VStack } from "@astryxdesign/core/VStack";
import { Text } from "@astryxdesign/core/Text";
import { useId } from "react";

/**
 * TDS의 line variant TextField.
 *
 * Astryx TextInput은 테두리로 둘러싼 박스형이라 TDS의 밑줄형과 인상이
 * 다르다. 라벨이 값 위에 작게 붙고 아래쪽 1px 선만 남는 형태를
 * 프리미티브와 토큰으로 구성한다.
 */
export type LineTextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** 값 뒤에 붙는 단위 (예: "원") */
  suffix?: string;
  inputMode?: "text" | "numeric";
  hasAutoFocus?: boolean;
};

function LineTextField({
  label,
  value,
  onChange,
  placeholder,
  suffix,
  inputMode = "text",
  hasAutoFocus,
}: LineTextFieldProps) {
  const id = useId();
  const isFilled = value !== "";

  return (
    <VStack
      gap={1}
      paddingBlock={2}
      className="w-full border-b border-gray-300 border-default focus-within:border-b-2 focus-within:border-[var(--color-accent)]"
    >
      <Text
        as="label"
        id={id}
        type="supporting"
        size="2xs"
        weight="medium"
        color={isFilled ? "accent" : "secondary"}
      >
        {label}
      </Text>

      <div className="flex items-baseline gap-1">
        <input
          aria-labelledby={id}
          // text-placeholder는 브리지에 없는 이름이라 무시된다. 시스템에서
          // 가장 옅은 텍스트 토큰인 disabled로 맞춘다.
          className="min-w-0 flex-1 bg-transparent text-lg font-semibold text-primary outline-none placeholder:font-normal placeholder:text-disabled"
          value={value}
          placeholder={placeholder}
          inputMode={inputMode}
          autoFocus={hasAutoFocus}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix && isFilled && (
          <Text type="large" weight="semibold">
            {suffix}
          </Text>
        )}
      </div>
    </VStack>
  );
}

export default LineTextField;
