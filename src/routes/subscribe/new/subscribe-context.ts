import { createContext, useContext } from "react";
import type { BillingCycle, SubscribeCategory } from "../../../types/subscribe";

export type SubscribeStep = "select_service" | "select_pay";

export type SubscribeContextValue = {
  category: SubscribeCategory | null;
  onChangeCategory: (value: SubscribeCategory) => void;
  service: string | null;
  onChangeService: (value: string) => void;
  billingCycle: BillingCycle | null;
  onChangeBillingCycle: (value: BillingCycle) => void;
  price: number | null;
  onChangePrice: (value: number | null) => void;
  paymentDate: Date | null;
  // DateInput은 선택 해제를 지원하므로 null도 받는다.
  onChangePaymentDate: (value: Date | null) => void;
  onChangeStep: (value: SubscribeStep) => void;
};

export const SubscribeContext = createContext<SubscribeContextValue | null>(
  null,
);

export function useSubscribeContext(component: string) {
  const context = useContext(SubscribeContext);

  if (!context) {
    throw new Error(`${component}는 Subscirbe 내부에서만 사용할 수 있어요.`);
  }

  return context;
}
