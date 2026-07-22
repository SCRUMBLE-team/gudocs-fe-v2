import { Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Text } from "@astryxdesign/core/Text";
import SubscriptionDetailContent from "./detail-content";

function SubscribeDetailPage() {
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
        <Text type="body" weight="bold" className="flex-1 text-center">
          구독 상세
        </Text>
        {/* 좌측 뒤로가기 버튼과 균형을 맞춰 타이틀을 가운데 정렬하기 위한 스페이서 */}
        <VStack className="w-10 shrink-0" />
      </HStack>

      {id && (
        <Suspense>
          <SubscriptionDetailContent id={id} />
        </Suspense>
      )}
    </VStack>
  );
}

export default SubscribeDetailPage;
