import { useState } from "react";
import SheetSelectField from "../../../../components/line-field/sheet-select-field";
import LineTextField from "../../../../components/line-field/line-text-field";
import { getServiceLogo } from "../../../../constants/category";
import { useCatalogQuery } from "../../../../hooks/query/useCatalogQuery";
import { useSubscribeContext } from "../subscribe-context";

function ServiceField() {
  const { category, service, serviceCode, onChangeService } =
    useSubscribeContext("ServiceField");
  const { data: catalog } = useCatalogQuery();

  /*
   * 이 카테고리에서 고를 수 있는 서비스.
   *
   * 종료된 서비스는 뺀다 — 과거 영수증 OCR 인식용으로 카탈로그에 남아 있을 뿐
   * 지금 새로 가입할 수 있는 대상이 아니다.
   */
  const options = catalog.services.filter(
    (item) => item.category === category && item.selectable,
  );

  // 초기 서비스명이 목록에 없으면(OCR 인식 결과나 직접 입력한 값) 곧바로 자유
  // 입력으로 연다. 목록형으로 두면 SheetSelectField가 짝을 못 찾아 값이 state에는
  // 있는데 화면에는 placeholder가 보인다.
  const [custom, setCustom] = useState(
    () => !!service && !options.some((item) => item.code === serviceCode),
  );
  const [prevCategory, setPrevCategory] = useState(category);

  // 카테고리가 바뀌면 고른 서비스는 무효가 되므로 초기화한다.
  if (category !== prevCategory) {
    setPrevCategory(category);
    setCustom(category === "ETC");
    onChangeService("", null);
  }

  // 자유 입력으로 열렸는데 code가 남아 있으면 비운다.
  // OCR이 신규 등록 불가 서비스(쿠팡이츠 등)를 인식하면 목록에 없어 자유 입력이 되는데,
  // 사용자가 이름을 손대지 않고 제출하면 그 code가 그대로 실려 서버가 400으로 막는다.
  if (custom && serviceCode && !options.some((item) => item.code === serviceCode)) {
    onChangeService(service ?? "", null);
  }

  if (!category) {
    return null;
  }

  // 카탈로그에 ETC 서비스는 없다. 목록을 띄울 게 없으니 바로 자유 입력이다.
  if (custom || options.length === 0) {
    return (
      <LineTextField
        label="서비스"
        placeholder="서비스명"
        value={service ?? ""}
        // 직접 입력한 이름은 카탈로그에 없으므로 code도 없다.
        onChange={(value) => onChangeService(value, null)}
      />
    );
  }

  return (
    <SheetSelectField
      label="서비스"
      placeholder="서비스명"
      options={options.map((item) => {
        const logo = getServiceLogo(item.code);
        return {
          // 선택값은 표시명이 아니라 code다. 이름은 바뀔 수 있고 겹칠 수도 있어서
          // 이름으로 되찾으면 엉뚱한 서비스의 code가 실릴 수 있다.
          value: item.code,
          label: item.name,
          icon: logo ? (
            <img
              src={logo}
              alt=""
              className="h-6 w-6 shrink-0 rounded object-contain"
            />
          ) : undefined,
        };
      })}
      value={serviceCode}
      onChange={(code) => {
        const selected = options.find((item) => item.code === code);
        onChangeService(selected?.name ?? "", selected?.code ?? null);
      }}
      footerAction={{
        label: "직접 입력",
        onSelect: () => {
          setCustom(true);
          onChangeService("", null);
        },
      }}
    />
  );
}

export default ServiceField;
