import { Card } from "@astryxdesign/core/Card";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../components/empty-state";

function EmptySubscription() {
  const navigate = useNavigate();

  return (
    <Card className="border-gray-300">
      <EmptyState
        message="아직 등록하신 구독 서비스가 없어요"
        action={{
          label: "구독 서비스 등록하러가기",
          onClick: () => navigate("/subscribe/new"),
        }}
      />
    </Card>
  );
}

export default EmptySubscription;
