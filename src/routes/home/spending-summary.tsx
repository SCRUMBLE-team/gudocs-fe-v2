import { Card } from "@astryxdesign/core/Card";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";

const MONTHLY_SPENDING = [
  { label: "1월", amount: 6 },
  { label: "2월", amount: 5 },
  { label: "3월", amount: 4 },
  { label: "4월", amount: 3 },
  { label: "5월", amount: 2 },
  { label: "6월", amount: 1 },
];

const MAX_AMOUNT = 10;

function SpendingSummary() {
  return (
    <Card className="border-gray-300">
      <VStack gap={3}>
        <VStack gap={0.5}>
          <Text type="large" weight="bold">
            이번달 구독료 확인
          </Text>
          <Text type="supporting">지난달 대비 22만원 덜 쓰는 중</Text>
        </VStack>

        {/* Astryx에는 차트 컴포넌트가 없어 프리미티브로 구성한 임시 막대 표현.
            각 열은 stretch로 높이를 확정받아야 막대의 백분율 높이가 계산된다. */}
        <HStack gap={2} height={140} align="stretch">
          {MONTHLY_SPENDING.map(({ label, amount }) => (
            <VStack
              key={label}
              gap={1}
              align="center"
              justify="end"
              className="flex-1"
            >
              <Text type="supporting" size="2xs">
                {amount}
              </Text>
              <VStack
                className="w-full shrink-0 rounded-t-sm bg-accent"
                height={`${(amount / MAX_AMOUNT) * 100}%`}
              />
              <Text type="supporting" size="2xs">
                {label}
              </Text>
            </VStack>
          ))}
        </HStack>

        <Button
          label="지출 금액 자세히 보러가기"
          variant="primary"
          className="p-6"
        />
      </VStack>
    </Card>
  );
}

export default SpendingSummary;
