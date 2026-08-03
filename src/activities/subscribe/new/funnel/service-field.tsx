import { useState } from "react";
import SheetSelectField from "../../../../components/line-field/sheet-select-field";
import LineTextField from "../../../../components/line-field/line-text-field";
import { CATEGORY_SERVICES } from "../../../../constants/category";
import { useSubscribeContext } from "../subscribe-context";

function ServiceField() {
  const { category, service, onChangeService } =
    useSubscribeContext("ServiceField");
  // 초기 서비스명이 목록에 없으면(OCR 인식 결과나 예전에 직접 입력한 값)
  // 곧바로 자유 입력으로 연다. 목록형으로 두면 SheetSelectField가 짝을 못 찾아
  // 값이 state에는 있는데 화면에는 placeholder가 보인다.
  const [custom, setCustom] = useState(
    () =>
      category != null &&
      !!service &&
      !CATEGORY_SERVICES[category].some((option) => option.name === service),
  );
  const [prevCategory, setPrevCategory] = useState(category);

  // 카테고리가 바뀌면 고른 서비스는 무효가 되므로 초기화한다.
  if (category !== prevCategory) {
    setPrevCategory(category);
    setCustom(category === "ETC");
    onChangeService("");
  }

  if (!category) {
    return null;
  }

  if (custom || category === "ETC") {
    return (
      <LineTextField
        label="서비스"
        placeholder="서비스명"
        value={service ?? ""}
        onChange={onChangeService}
      />
    );
  }

  const options = CATEGORY_SERVICES[category].map((s) => ({
    value: s.name,
    label: s.name,
    icon: (
      <img
        src={s.logo}
        alt=""
        className="h-6 w-6 shrink-0 rounded object-contain"
      />
    ),
  }));

  return (
    <SheetSelectField
      label="서비스"
      placeholder="서비스명"
      options={options}
      value={service}
      onChange={onChangeService}
      footerAction={{
        label: "직접 입력",
        onSelect: () => {
          setCustom(true);
          onChangeService("");
        },
      }}
    />
  );
}

export default ServiceField;
