import { useState } from "react";
import type { StaticActivityComponentType } from "@stackflow/react";
import { useGoBack } from "../../../../hooks/useGoBack";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Heading } from "@astryxdesign/core/Heading";
import FixedBottomCTA from "../../../../components/fixed-bottom-cta";
import LineTextField from "../../../../components/line-field/line-text-field";
import { isSubscribeCategory } from "../../../../constants/category";
import { useFunnelFlow } from "../use-funnel-flow";

/**
 * 카탈로그에 없는 서비스를 직접 입력한다.
 *
 * 카테고리 목록에서 들어왔다면 방금 고른 값을 그대로 쓰고, 서비스 선택 화면에서
 * 바로 들어왔다면 기타(ETC)로 분류한다. 어느 경로든 이 화면에서는 서비스명만
 * 묻는다.
 */
const SubscribeNewCustomActivity: StaticActivityComponentType<
  "SubscribeNewCustom"
> = ({ params }) => {
  const [service, setService] = useState("");
  // 주소창을 거쳐 들어오는 값이라 아는 카테고리만 유지한다. 메인 서비스 선택
  // 화면에서 바로 들어오거나 값이 잘못됐으면 서버 필수값을 기타로 채운다.
  const category = isSubscribeCategory(params.category)
    ? params.category
    : "ETC";

  const goBack = useGoBack();
  const { pushPay } = useFunnelFlow();

  const name = service.trim();
  const canSubmit = name !== "";

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

        <VStack className="flex-1">
          <VStack paddingInline={4} paddingBlock={2} gap={5}>
            <Heading level={2} className="whitespace-pre-line">
              {"구독 중인 서비스를\n알려주세요"}
            </Heading>

            <LineTextField
              label="서비스"
              placeholder="서비스명"
              value={service}
              onChange={setService}
              hasAutoFocus
            />
          </VStack>

          {canSubmit && (
            <FixedBottomCTA
              label="다음으로"
              onClick={() => pushPay({ code: null, name, category })}
            />
          )}
        </VStack>
      </VStack>
    </AppScreen>
  );
};

export default SubscribeNewCustomActivity;
