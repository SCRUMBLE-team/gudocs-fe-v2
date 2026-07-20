import { useState } from "react";
import { Calendar } from "@astryxdesign/core/Calendar";
import type { ISODateString } from "@astryxdesign/core/Calendar";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { Icon } from "@astryxdesign/core/Icon";
import BottomSheet from "../../../../components/bottom-sheet";
import { useSubscribeContext } from "../subscribe-context";

/**
 * Date -> YYYY-MM-DD.
 * toISOString()은 UTC로 변환하므로 한국 시간 자정 근처에서 날짜가 하루
 * 밀린다. 로컬 기준 연·월·일을 그대로 조합한다.
 */
function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}` as ISODateString;
}

function fromISODate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

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
            value={paymentDate ? toISODate(paymentDate) : undefined}
            max={toISODate(new Date())}
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
