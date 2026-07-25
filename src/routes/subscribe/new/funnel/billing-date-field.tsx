import { useState } from "react";
import { Calendar } from "@astryxdesign/core/Calendar";
import type { ISODateString } from "@astryxdesign/core/Calendar";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { Icon } from "@astryxdesign/core/Icon";
import BottomSheet from "../../../../components/bottom-sheet";
import { fromISODate, toISODate } from "../../../../utils/date";
import { useSubscribeContext } from "../subscribe-context";

function formatKorean(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

/**
 * TDS는 휠 피커를 바텀시트에 띄웠다. Astryx에 휠 피커는 없으므로
 * 같은 시트 흐름을 유지한 채 Calendar를 담는다.
 */
function BillingDateField() {
  const { billingCycle, price, paymentDate, onChangePaymentDate } =
    useSubscribeContext("BillingDateField");
  const [isOpen, setIsOpen] = useState(false);

  if (!billingCycle || price == null) {
    return null;
  }

  return (
    <>
      <HStack
        as="button"
        onClick={() => setIsOpen(true)}
        align="center"
        justify="between"
        paddingBlock={2}
        className="w-full border-b border-gray-300 text-left"
      >
        <VStack gap={1} align="start">
          <Text
            type="supporting"
            size="2xs"
            weight="medium"
            color={paymentDate ? "accent" : "secondary"}
          >
            최근 결제일
          </Text>
          <Text
            type="large"
            weight="semibold"
            color={paymentDate ? "primary" : "disabled"}
          >
            {paymentDate ? formatKorean(paymentDate) : "최근 결제일"}
          </Text>
        </VStack>
        <Icon icon="calendar" size="sm" color="tertiary" />
      </HStack>

      <BottomSheet isOpen={isOpen} onOpenChange={setIsOpen} title="최근 결제일">
        <VStack align="center" paddingBlock={2}>
          <Calendar
            mode="single"
            value={
              paymentDate
                ? (toISODate(paymentDate) as ISODateString)
                : undefined
            }
            max={toISODate(new Date()) as ISODateString}
            onChange={(value) => {
              onChangePaymentDate(
                typeof value === "string" ? fromISODate(value) : null,
              );
              setIsOpen(false);
            }}
          />
        </VStack>
      </BottomSheet>
    </>
  );
}

export default BillingDateField;
