import { Suspense } from "react";
import type { StaticActivityComponentType } from "@stackflow/react";
import { useGoBack } from "../../../hooks/useGoBack";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Text } from "@astryxdesign/core/Text";
import SubscriptionDetailContent from "./detail-content";

const SubscribeDetailActivity: StaticActivityComponentType<
  "SubscribeDetail"
> = ({ params }) => {
  const goBack = useGoBack();

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
          <Text type="body" weight="bold" className="flex-1 text-center">
            구독 상세
          </Text>

          {/* 좌측 뒤로가기 버튼과 같은 폭(32px)을 차지해 타이틀을 정확히 가운데 둔다. */}
          <VStack className="w-8 shrink-0" />
        </HStack>

        <Suspense>
          <SubscriptionDetailContent id={params.id} />
        </Suspense>
      </VStack>
    </AppScreen>
  );
};

export default SubscribeDetailActivity;
