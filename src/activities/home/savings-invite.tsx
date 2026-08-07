import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { useFlow } from "@stackflow/react";
import Lottie from "lottie-react";
import { useSubscriptionsQuery } from "../../hooks/query/useSubscriptionsQuery";
import discountLottie from "../../assets/lottie/discount.json";

/**
 * 구독 정리(절약 계산) 진입 카드.
 *
 * 원래 소비 분석 상세 맨 아래에 있었는데, 거기까지 들어가야 보이는 자리라
 * 존재를 모르고 지나치기 쉬웠다. 대시보드로 올려 첫 화면에서 닿게 한다.
 *
 * 구독이 하나도 없으면 정리할 것도 없으므로 카드를 통째로 감춘다.
 * (그래도 주소로 바로 들어오는 경로가 있어서 Savings 화면 자체도 빈 상태를 따로 그린다.)
 */
function SavingsInvite() {
  const { push } = useFlow();
  const { data: subscriptions } = useSubscriptionsQuery({});

  if (subscriptions.length === 0) return null;

  return (
    <Card className="border-gray-300">
      <VStack gap={2}>
        <Text type="large" weight="bold">
          구독을 정리하면 얼마나 아낄까요?
        </Text>
        <Text type="supporting" color="secondary">
          체크만 해보면 월 구독료가 얼마나 줄어드는지 알려드려요
        </Text>
        <Lottie animationData={discountLottie} loop />
        {/* 바로 위 소비 분석 카드의 버튼과 같은 무게로 보이도록 맞춘다. */}
        <Button
          label="절약 금액 계산해보기"
          variant="primary"
          className="p-6"
          onClick={() => push("Savings", {})}
        />
      </VStack>
    </Card>
  );
}

export default SavingsInvite;
