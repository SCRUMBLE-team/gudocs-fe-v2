import { FixedBottomCTA, ListHeader } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import CategoryField from "./category-field";
import ServiceField from "./service-field";
import { useSubscribeContext } from "../subscribe-context";

function SelectService() {
  const { category, service, onChangeStep } =
    useSubscribeContext("SelectService");

  const title = !category
    ? "구독하는 서비스의\n카테고리를 알려주세요"
    : "어떤 서비스를\n구독하고 계신가요?";

  return (
    <>
      <ListHeader
        className="mb-3"
        size="large"
        title={
          <ListHeader.TitleParagraph color={colors.grey800} fontWeight="bold">
            {title}
          </ListHeader.TitleParagraph>
        }
        rightAlignment="center"
      />
      <CategoryField />
      <ServiceField />
      {category && service && (
        <FixedBottomCTA
          takeSpace={true}
          showAfterDelay={{ animation: "slide", delay: 0 }}
          onTap={() => onChangeStep("select_pay")}
        >
          다음으로
        </FixedBottomCTA>
      )}
    </>
  );
}

export default SelectService;
