import { Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import EditForm from "./edit-form";

function SubscribeEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <VStack className="flex-1" isScrollable>
      <HStack paddingInline={2} paddingBlock={2} align="center">
        <IconButton
          label="뒤로 가기"
          icon={<Icon icon="chevronLeft" />}
          variant="ghost"
          onClick={() => navigate(-1)}
        />
      </HStack>

      {id && (
        <Suspense>
          <EditForm id={id} />
        </Suspense>
      )}
    </VStack>
  );
}

export default SubscribeEditPage;
