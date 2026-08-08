import SheetSelectField from "../line-field/sheet-select-field";
import AssetIcon from "../asset-icon";
import { CATEGORY_META } from "../../constants/category";
import type { SubscribeCategory } from "../../types/subscribe";

const CATEGORY_OPTIONS = Object.entries(CATEGORY_META).map(([code, meta]) => ({
  value: code as SubscribeCategory,
  label: meta.label,
  icon: <AssetIcon name={meta.icon} />,
}));

export type CategorySelectFieldProps = {
  value: SubscribeCategory | null;
  onChange: (category: SubscribeCategory) => void;
  placeholder?: string;
};

/**
 * 구독 카테고리를 고르는 기존 line field + bottom sheet UI.
 *
 * 메인 탐색 화면과 등록/수정 폼이 같은 카테고리 선택 UI를 쓰도록 컨텍스트와
 * 분리했다. 카테고리 데이터와 아이콘도 한 곳에서만 조립한다.
 */
function CategorySelectField({
  value,
  onChange,
  placeholder = "카테고리",
}: CategorySelectFieldProps) {
  return (
    <SheetSelectField
      label="카테고리"
      placeholder={placeholder}
      options={CATEGORY_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}

export default CategorySelectField;
