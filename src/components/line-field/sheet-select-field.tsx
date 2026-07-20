import { useState, type ReactNode } from "react";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { Icon } from "@astryxdesign/core/Icon";
import { List } from "@astryxdesign/core/List";
import { ListItem } from "@astryxdesign/core/List";
import BottomSheet from "../bottom-sheet";

/**
 * TDS 패턴: line 필드처럼 생긴 트리거를 누르면 바텀시트가 열리고,
 * 목록에서 하나를 고르면 닫힌다.
 *
 * 드롭다운(Selector)이 아니라 시트를 쓰는 이유는 원본 TDS 화면과 같은
 * 조작감을 유지하기 위해서다. 같은 스텝의 다른 입력들이 전부 line 필드라
 * 트리거도 같은 모양이어야 네 줄이 하나로 읽힌다.
 */
export type SheetSelectOption<T extends string> = {
  value: T;
  label: string;
  /** 목록 행 왼쪽에 붙는 아이콘 */
  icon?: ReactNode;
};

export type SheetSelectFieldProps<T extends string> = {
  label: string;
  placeholder?: string;
  options: readonly SheetSelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  /** 목록 맨 아래에 붙는 추가 동작 (예: 직접 입력) */
  footerAction?: { label: string; onSelect: () => void };
};

function SheetSelectField<T extends string>({
  label,
  placeholder,
  options,
  value,
  onChange,
  footerAction,
}: SheetSelectFieldProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const selected = options.find((option) => option.value === value);

  return (
    <>
      <HStack
        as="button"
        onClick={() => setIsOpen(true)}
        align="center"
        justify="between"
        paddingBlock={2}
        className="w-full border-b border-gray-300 text-left"
      >
        <VStack gap={1} align="start">
          <Text
            type="supporting"
            size="2xs"
            weight="medium"
            color={selected ? "accent" : "secondary"}
          >
            {label}
          </Text>
          {/* Astryx의 color="placeholder"는 --color-text-secondary(#464552)로
              매핑돼 본문 색 옆에서 거의 검정으로 읽힌다. 시스템에서 가장 옅은
              텍스트 토큰인 disabled(#908F9D)를 써야 placeholder처럼 보인다. */}
          <Text
            type="large"
            weight="semibold"
            color={selected ? "primary" : "disabled"}
          >
            {selected ? selected.label : (placeholder ?? label)}
          </Text>
        </VStack>
        <Icon icon="chevronDown" size="sm" color="tertiary" />
      </HStack>

      <BottomSheet isOpen={isOpen} onOpenChange={setIsOpen} title={label}>
        <List density="spacious">
          {options.map((option) => (
            <ListItem
              key={option.value}
              label={option.label}
              // 선택 상태는 체크 표시로만 알린다. aria-selected는 스크린리더에
              // 필요하므로 남기고 배경 강조만 없앤다. Tailwind 유틸리티는
              // utilities 레이어라 astryx-base의 컴포넌트 스타일을 이긴다.
              isSelected={option.value === value}
              className="aria-selected:bg-transparent"
              startContent={option.icon}
              endContent={
                option.value === value ? (
                  <Icon icon="check" size="sm" color="accent" />
                ) : undefined
              }
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            />
          ))}
          {footerAction && (
            <ListItem
              label={footerAction.label}
              onClick={() => {
                footerAction.onSelect();
                setIsOpen(false);
              }}
            />
          )}
        </List>
      </BottomSheet>
    </>
  );
}

export default SheetSelectField;
