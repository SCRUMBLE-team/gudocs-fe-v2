import { Card } from "@astryxdesign/core/Card";
import { useFlow } from "@stackflow/react";
import EmptyState from "../../components/empty-state";

function EmptySubscription() {
  const { push } = useFlow();

  return (
    <Card className="border-gray-300">
      <EmptyState
        message="아직 등록하신 구독 서비스가 없어요"
        action={{
          label: "구독 서비스 등록하러가기",
          onClick: () => push("SubscribeNewStart", {}),
        }}
      />
    </Card>
  );
}

export default EmptySubscription;
