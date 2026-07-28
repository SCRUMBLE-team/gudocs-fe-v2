import { Suspense } from "react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react";
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
  const { pop } = useFlow();

  return (
    <AppScreen>
      <VStack minHeight="100%">
        <HStack paddingInline={2} paddingBlock={2} align="center">
          <IconButton
            label="뒤로 가기"
            icon={<Icon icon="chevronLeft" />}
            variant="ghost"
            onClick={() => pop()}
          />
          <Text type="body" weight="bold" className="flex-1 text-center">
            구독 상세
          </Text>

          <VStack className="w-10 shrink-0" />
        </HStack>

        <Suspense>
          <SubscriptionDetailContent id={params.id} />
        </Suspense>
      </VStack>
    </AppScreen>
  );
};

export default SubscribeDetailActivity;
