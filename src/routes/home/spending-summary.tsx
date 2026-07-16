import Card from "../../components/card";
import { Paragraph, BarChart, Button } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";

function SpendingSummary() {
  return (
    <Card>
      <Paragraph typography="t5" fontWeight="bold">
        <Paragraph.Text color={colors.grey900}>
          이번달 구독료 확인
        </Paragraph.Text>
      </Paragraph>
      <Paragraph typography="t7">
        <Paragraph.Text color={colors.grey600}>
          지난달 대비 22만원 덜 쓰는 중
        </Paragraph.Text>
      </Paragraph>
      <BarChart
        data={[
          { maxValue: 10, value: 6, label: "1월", barAnnotation: 6 },
          { maxValue: 10, value: 5, label: "2월", barAnnotation: 5 },
          { maxValue: 10, value: 4, label: "3월", barAnnotation: 4 },
          { maxValue: 10, value: 3, label: "4월", barAnnotation: 3 },
          { maxValue: 10, value: 2, label: "5월", barAnnotation: 2 },
          { maxValue: 10, value: 1, label: "6월", barAnnotation: 1 },
        ]}
        fill={{
          type: "single-bar",
          barIndex: 0,
          theme: "blue",
        }}
      />
      <Button display="block" size="medium">
        지출 금액 자세히 보러가기
      </Button>
    </Card>
  );
}

export default SpendingSummary;
