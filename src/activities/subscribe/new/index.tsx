import { useState } from "react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Heading } from "@astryxdesign/core/Heading";
import FixedBottomCTA from "../../../components/fixed-bottom-cta";
import type { SubscribeCategory } from "../../../types/subscribe";
import { SubscribeContext } from "./subscribe-context";
import CategoryField from "./funnel/category-field";
import ServiceField from "./funnel/service-field";

/**
 * 구독 등록 퍼널 1단계 — 카테고리와 서비스를 고른다.
 *
 * 2단계는 별개 액티비티(SubscribeNewPay)다. 고른 값은 액티비티 파라미터로 넘긴다.
 * 이 화면은 그동안 계속 마운트돼 있어서, 2단계에서 뒤로 오면 선택값이 그대로 남는다.
 */
const SubscribeNewActivity: StaticActivityComponentType<"SubscribeNew"> = () => {
  const [category, setCategory] = useState<SubscribeCategory | null>(null);
  const [service, setService] = useState<string | null>(null);
  const { push, pop } = useFlow();

  const title = !category
    ? "구독하는 서비스의\n카테고리를 알려주세요"
    : "어떤 서비스를\n구독하고 계신가요?";

  return (
    // 퍼널 필드들은 SubscribeContext에 바인딩돼 있다. 이 화면이 쓰지 않는 결제 관련
    // 값은 2단계가 채우므로 여기서는 비워 둔다.
    <SubscribeContext.Provider
      value={{
        category,
        onChangeCategory: setCategory,
        service,
        onChangeService: setService,
        billingCycle: null,
        onChangeBillingCycle: () => {},
        price: null,
        onChangePrice: () => {},
        paymentDate: null,
        onChangePaymentDate: () => {},
      }}
    >
      <AppScreen>
        <VStack minHeight="100%">
          <HStack paddingInline={2} paddingBlock={2} align="center">
            <IconButton
              label="뒤로 가기"
              icon={<Icon icon="chevronLeft" />}
              variant="ghost"
              onClick={() => pop()}
            />
          </HStack>

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
                onClick={() => push("SubscribeNewPay", { category, service })}
              />
            )}
          </VStack>
        </VStack>
      </AppScreen>
    </SubscribeContext.Provider>
  );
};

export default SubscribeNewActivity;
