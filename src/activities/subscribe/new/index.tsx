import { Suspense } from "react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react";
import { useGoBack } from "../../../hooks/useGoBack";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Heading } from "@astryxdesign/core/Heading";
import { Spinner } from "@astryxdesign/core/Spinner";
import ServicePicker from "../../../components/service-picker";
import { useFunnelFlow } from "./use-funnel-flow";

/**
 * 구독 등록 퍼널 1단계 — 어떤 서비스를 구독 중인지 고른다.
 *
 * 예전에는 카테고리를 먼저 물었지만, 카테고리는 카탈로그의 서비스가 이미 들고
 * 있는 값이라 사용자에게 다시 물을 이유가 없었다. 지금은 서비스만 고르면
 * 카테고리가 따라오고, 카테고리는 이름이 기억나지 않을 때의 탐색 수단으로만
 * 남는다. 카테고리를 직접 골라야 하는 건 카탈로그에 없는 서비스뿐이다
 * (SubscribeNewCustom).
 *
 * 화면 골격(제목 크기·좌우 여백·메뉴 행 모양)은 등록 방식 선택 화면(start)을
 * 그대로 따른다. 같은 퍼널의 연속된 두 화면이라 여백이 어긋나면 바로 보인다.
 */
const SubscribeNewActivity: StaticActivityComponentType<
  "SubscribeNew"
> = () => {
  const { push } = useFlow();
  const goBack = useGoBack();
  const { pushPay } = useFunnelFlow();

  return (
    <AppScreen>
      <VStack minHeight="100%">
        <HStack paddingInline={2} paddingBlock={2} align="center">
          <IconButton
            label="뒤로 가기"
            icon={<Icon icon="chevronLeft" />}
            variant="ghost"
            onClick={goBack}
          />
        </HStack>

        <VStack paddingInline={4} paddingBlock={2} gap={4}>
          <Heading level={2} className="text-balance">
            어떤 서비스를 구독하고 있나요?
          </Heading>

          {/* 카탈로그는 suspense 쿼리라 경계가 필요하다. 없으면 첫 진입에서
              스택 전체가 날아간다. */}
          <Suspense
            fallback={
              <VStack align="center" paddingBlock={10}>
                <Spinner size="lg" />
              </VStack>
            }
          >
            <ServicePicker
              onSelect={pushPay}
              onSelectCategory={(category) =>
                push("SubscribeNewCategory", { category })
              }
              onCustom={() => push("SubscribeNewCustom", {})}
            />
          </Suspense>
        </VStack>
      </VStack>
    </AppScreen>
  );
};

export default SubscribeNewActivity;
