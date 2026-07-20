import { Card } from "@astryxdesign/core/Card";
import { VStack } from "@astryxdesign/core/VStack";
import { Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import emptyLottie from "../../assets/lottie/empty.json";

function EmptySubscription() {
  const navigate = useNavigate();

  return (
    <Card className="border-gray-300">
      <VStack align="center" gap={2}>
        <Lottie
          animationData={emptyLottie}
          loop
          style={{ width: 200, height: 200 }}
        />
        <Text type="large" weight="bold">
          아직 등록하신 구독 서비스가 없어요
        </Text>
        <Button
          className="w-full p-6 "
          label="구독 서비스 등록하러가기"
          variant="primary"
          onClick={() => navigate("/subscribe/new")}
        />
      </VStack>
    </Card>
  );
}

export default EmptySubscription;
