import { VStack } from "@astryxdesign/core/VStack";
import { Text } from "@astryxdesign/core/Text";
import SheetSelectField from "../../../../components/line-field/sheet-select-field";
import { useCatalogQuery } from "../../../../hooks/query/useCatalogQuery";
import { formatWon } from "../../../../utils/format";
import { useSubscribeContext } from "../subscribe-context";

/**
 * 카탈로그가 아는 요금제를 골라 이용요금과 결제 주기를 한 번에 채운다.
 *
 * 사용자가 매번 금액을 검색해 입력하지 않게 하려는 것이 이 필드의 목적이다.
 * 다만 채워주는 값은 어디까지나 정가 기준 기본값이라, 고른 뒤에도 아래
 * 이용요금 칸에서 그대로 고칠 수 있다(할인·프로모션·구 요금제 사용자).
 *
 * 요금제를 확인하지 못한 서비스와 직접 입력한 서비스는 고를 게 없으므로
 * 이 필드를 아예 그리지 않고 기존처럼 금액을 직접 받는다.
 */
function PlanField() {
  const { serviceCode, price, billingCycle, onChangePrice, onChangeBillingCycle } =
    useSubscribeContext("PlanField");
  const { data: catalog } = useCatalogQuery();

  const plans = serviceCode
    ? (catalog.services.find((item) => item.code === serviceCode)?.plans ?? [])
    : [];

  if (plans.length === 0) {
    return null;
  }

  // 선택 상태를 따로 들지 않고 현재 금액·주기에서 되짚는다. 사용자가 금액을 직접
  // 고치면 어떤 요금제와도 안 맞으므로 자연스럽게 선택이 풀린다.
  const selected = plans.find(
    (plan) => plan.price === price && plan.billingCycle === billingCycle,
  );

  // 고른 요금제가 환산값이면 왜 실제 청구액과 다를 수 있는지 알려준다.
  const note = selected?.approximate
    ? "달러로 청구되는 서비스예요. 환율과 해외결제 수수료에 따라 실제 결제액이 달라질 수 있어요."
    : undefined;

  return (
    <VStack gap={1}>
      <SheetSelectField
      label="요금제"
      placeholder="요금제 선택"
      options={plans.map((plan) => ({
        value: plan.name,
        // 환산 추정치는 "약"을 붙여 정가와 구분한다.
        label: `${plan.name} · ${plan.approximate ? "약 " : ""}${formatWon(plan.price)}`,
      }))}
      value={selected?.name ?? null}
      onChange={(name) => {
        const plan = plans.find((item) => item.name === name);
        if (!plan) return;
        onChangePrice(plan.price);
        onChangeBillingCycle(plan.billingCycle);
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

export default PlanField;
