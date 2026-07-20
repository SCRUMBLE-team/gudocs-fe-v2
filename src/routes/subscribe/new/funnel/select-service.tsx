import { VStack } from "@astryxdesign/core/VStack";
import { Heading } from "@astryxdesign/core/Heading";
import FixedBottomCTA from "../../../../components/fixed-bottom-cta";
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
    <VStack className="flex-1">
      <VStack paddingInline={4} paddingBlock={2} gap={5}>
        <Heading level={2} className="whitespace-pre-line">
          {title}
        </Heading>

        <VStack gap={2}>
          <CategoryField />
          <ServiceField />
        </VStack>
      </VStack>

      {category && service && (
        <FixedBottomCTA
          label="다음으로"
          onClick={() => onChangeStep("select_pay")}
        />
      )}
    </VStack>
  );
}

export default SelectService;
