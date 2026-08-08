import { useId } from "react";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { Text } from "@astryxdesign/core/Text";
import { VisuallyHidden } from "@astryxdesign/core/VisuallyHidden";

export type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  placeholder: string;
  /** 접근성용 라벨. 화면에는 보이지 않는다. */
  label: string;
};

const SEARCH_FIELD_CLASS_NAME =
  "h-11 w-full rounded-xl border border-gray-300 bg-surface text-left focus-within:border-[var(--color-accent)] focus-within:ring-2 focus-within:ring-[var(--color-accent-muted)] focus-visible:border-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-muted)]";

/**
 * 메인 화면과 카테고리 서비스 화면이 함께 쓰는 서비스 검색 입력.
 *
 * Astryx TextInput을 쓰지 않는 이유는 line-text-field와 같다. TextInput은
 * 라벨·상태 메시지 자리를 포함한 폼 필드라 높이와 테두리 대비가 커서, 메뉴
 * 목록이 본문인 이 화면에서 검색창이 제일 무거운 요소가 되어버린다.
 * 여기서는 한 줄짜리 가벼운 상자만 필요하므로 프리미티브와 토큰으로 짠다.
 * 두 화면이 이 컴포넌트를 함께 써서 크기와 테두리가 어긋나지 않는다.
 */
function SearchField({
  value,
  onChange,
  placeholder,
  label,
  autoFocus,
}: SearchFieldProps) {
  const id = useId();

  return (
    <HStack
      align="center"
      gap={2}
      paddingInline={3}
      // border-default·border-strong 은 테두리 색 유틸리티를 만들어내지 않는다
      // (tailwind-theme.css 가 --color-border 를 배경 쪽으로만 이어준다).
      // 그대로 쓰면 Tailwind v4 기본값인 currentColor 가 먹어서 테두리가
      // 새까맣게 나온다. 주 탐색 입력이라 밑줄 필드와 같은 gray-300으로 잡는다.
      className={SEARCH_FIELD_CLASS_NAME}
    >
      <Icon icon="search" size="sm" color="tertiary" />

      <VisuallyHidden>
        <Text as="label" id={id}>
          {label}
        </Text>
      </VisuallyHidden>

      <input
        aria-labelledby={id}
        // type="search"로 두면 브라우저가 자체 지우기 버튼을 그려서 아래
        // 버튼과 X가 나란히 두 개 보인다. 모양을 우리가 잡으려면 text여야 한다.
        type="text"
        // text-placeholder는 브리지에 없는 이름이라 무시된다. 시스템에서 가장
        // 옅은 텍스트 토큰인 disabled로 맞춘다(line-text-field와 같은 이유).
        className="min-w-0 flex-1 bg-transparent text-base text-primary outline-none placeholder:text-disabled"
        name="subscription-service-search"
        autoComplete="off"
        autoFocus={autoFocus}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />

      {value !== "" && (
        <HStack
          as="button"
          align="center"
          aria-label="검색어 지우기"
          onClick={() => onChange("")}
        >
          <Icon icon="close" size="sm" color="tertiary" />
        </HStack>
      )}
    </HStack>
  );
}

export default SearchField;
