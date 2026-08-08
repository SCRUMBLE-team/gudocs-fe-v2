import CategorySelectField from "../../../../components/service-picker/category-select-field";
import { useSubscribeContext } from "../subscribe-context";

function CategoryField() {
  const { category, onChangeCategory } = useSubscribeContext("CategoryField");

  return <CategorySelectField value={category} onChange={onChangeCategory} />;
}

export default CategoryField;
