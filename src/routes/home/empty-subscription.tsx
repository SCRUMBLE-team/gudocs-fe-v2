import { colors } from "@toss/tds-colors";
import { Paragraph, Button } from "@toss/tds-mobile";
import Card from "../../components/card";
import SubscribeImage from "../../assets/subscribe.svg?react";

function EmptySubscription() {
  return (
    <Card className="flex flex-col items-center">
      <SubscribeImage className="w-48 h-48" />
      <Paragraph typography="t5" fontWeight="bold">
        <Paragraph.Text color={colors.grey900}>
          아직 등록하신 구독 서비스가 없어요
        </Paragraph.Text>
      </Paragraph>
      <Button display="block" size="medium">
        구독 서비스 등록하러가기
      </Button>
    </Card>
  );
}

export default EmptySubscription;
