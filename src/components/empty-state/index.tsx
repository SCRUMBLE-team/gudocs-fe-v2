import Lottie from "lottie-react";
import { VStack } from "@astryxdesign/core/VStack";
import { Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import emptyLottie from "../../assets/lottie/empty.json";

/**
 * 데이터가 없을 때 보여주는 일러스트 + 안내 문구.
 *
 * 카드 안에 넣을지 전체 화면으로 쓸지는 호출부가 정한다 — Card 래핑을 여기서
 * 하지 않아야 홈 카드와 소비 분석 화면이 같은 컴포넌트를 쓸 수 있다.
 */
export type EmptyStateProps = {
  /** 줄바꿈(\n)을 그대로 반영한다. */
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <VStack align="center" gap={2}>
      <Lottie
        animationData={emptyLottie}
        loop
        style={{ width: 200, height: 200 }}
      />
      <Text
        type="large"
        weight="bold"
        justify="center"
        className="whitespace-pre-line"
      >
        {message}
      </Text>
      {action && (
        <Button
          className="w-full p-6"
          label={action.label}
          variant="primary"
          onClick={action.onClick}
        />
      )}
    </VStack>
  );
}

export default EmptyState;
