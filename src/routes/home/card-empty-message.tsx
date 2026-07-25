import { VStack } from "@astryxdesign/core/VStack";
import { Text } from "@astryxdesign/core/Text";
import Lottie from "lottie-react";

/**
 * 홈 카드에서 차트 자리를 대신하는 짧은 안내.
 *
 * 구독이 하나도 없으면 홈의 카드 세 개가 동시에 비는데, 전부 일러스트를 깔면
 * 빈 화면이 로티로만 채워진다. 구독 카드만 EmptyState로 유도하고 나머지 둘은
 * 제목을 남긴 채 본문만 이걸로 바꿔 화면 구조를 유지한다.
 */
function CardEmptyMessage({
  animationData,
  message,
}: {
  animationData: unknown;
  message: string;
}) {
  return (
    <VStack paddingBlock={6} align="center" justify="center">
      <Lottie
        animationData={animationData}
        loop
        style={{ width: 200, height: 200 }}
      />
      <Text
        type="body"
        color="secondary"
        justify="center"
        className="whitespace-pre-line"
      >
        {message}
      </Text>
    </VStack>
  );
}

export default CardEmptyMessage;
