import { VStack } from "@astryxdesign/core/VStack";
import { Text } from "@astryxdesign/core/Text";
import LineTextField from "../../../../components/line-field/line-text-field";
import { useCatalogPlans } from "../../../../hooks/query/useCatalogPlans";
import type { BillingCycle } from "../../../../types/subscribe";
import { useSubscribeContext } from "../subscribe-context";

/** 999,999,999원 */
const MAX_DIGITS = 9;

type PriceInputProps = {
  price: number | null;
  onChangePrice: (value: number | null) => void;
  note?: string;
};

function PriceInput({ price, onChangePrice, note }: PriceInputProps) {
  return (
    <VStack gap={1}>
      <LineTextField
        label="이용요금"
        suffix="원"
        inputMode="numeric"
        value={price == null ? "" : price.toLocaleString("ko-KR")}
        onChange={(value) => {
          const digits = value.replace(/[^0-9]/g, "").slice(0, MAX_DIGITS);
          onChangePrice(digits === "" ? null : Number(digits));
        }}
      />
      {note && (
        <Text type="supporting" color="secondary">
          {note}
        </Text>
      )}
    </VStack>
  );
}

type CatalogPriceInputProps = Omit<PriceInputProps, "note"> & {
  serviceCode: string;
  billingCycle: BillingCycle | null;
};

/** 카탈로그 서비스일 때만 기본 금액 안내를 계산한다. */
function CatalogPriceInput({
  serviceCode,
  billingCycle,
  price,
  onChangePrice,
}: CatalogPriceInputProps) {
  const plans = useCatalogPlans(serviceCode);

  // 지금 금액이 카탈로그 요금제와 그대로면 우리가 채운 값이다. 사용자가 한 자라도
  // 고치면 어떤 요금제와도 안 맞으니 안내가 저절로 사라진다.
  const seeded = plans.find(
    (plan) => plan.price === price && plan.billingCycle === billingCycle,
  );

  // 환산 추정치일 때는 plan-field가 이미 더 중요한 안내(환율·해외결제 수수료)를
  // 띄우고 있다. 여기까지 붙이면 한 화면에 안내가 두 줄로 겹친다.
  const note =
    seeded && !seeded.approximate
      ? "기본 금액이에요. 수정할 수 있어요."
      : undefined;

  return <PriceInput price={price} onChangePrice={onChangePrice} note={note} />;
}

function PriceField() {
  const { serviceCode, price, billingCycle, onChangePrice } =
    useSubscribeContext("PriceField");

  // 직접 입력 서비스에는 카탈로그 요금제가 없으므로 쿼리 자체를 시작하지 않는다.
  if (!serviceCode) {
    return <PriceInput price={price} onChangePrice={onChangePrice} />;
  }

  return (
    <CatalogPriceInput
      serviceCode={serviceCode}
      billingCycle={billingCycle}
      price={price}
      onChangePrice={onChangePrice}
    />
  );
}

export default PriceField;
