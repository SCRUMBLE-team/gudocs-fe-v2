import { Suspense } from "react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import EditForm from "./edit-form";

const SubscribeEditActivity: StaticActivityComponentType<"SubscribeEdit"> = ({
  params,
}) => {
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
        </HStack>
        <Suspense>
          <EditForm id={params.id} />
        </Suspense>
      </VStack>
    </AppScreen>
  );
};

export default SubscribeEditActivity;
