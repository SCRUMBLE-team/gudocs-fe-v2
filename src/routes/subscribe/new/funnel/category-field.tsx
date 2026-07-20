import SheetSelectField from "../../../../components/line-field/sheet-select-field";
import AssetIcon from "../../../../components/asset-icon";
import { CATEGORY_META } from "../../../../constants/category";
import type { SubscribeCategory } from "../../../../types/subscribe";
import { useSubscribeContext } from "../subscribe-context";

const CATEGORY_OPTIONS = Object.entries(CATEGORY_META).map(([code, meta]) => ({
  value: code as SubscribeCategory,
  label: meta.label,
  icon: <AssetIcon name={meta.icon} />,
}));

function CategoryField() {
  const { category, onChangeCategory } = useSubscribeContext("CategoryField");

  return (
    <SheetSelectField
      label="카테고리"
      placeholder="카테고리"
      options={CATEGORY_OPTIONS}
      value={category}
      onChange={onChangeCategory}
    />
  );
}

export default CategoryField;
