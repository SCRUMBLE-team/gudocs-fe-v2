import { createContext, useContext } from "react";
import type { BillingCycle, SubscribeCategory } from "../../../types/subscribe";

/**
 * 퍼널 필드(category-field 등)들이 공유하는 값.
 *
 * 등록 퍼널은 두 화면이 각자 자기 몫만 상태로 들고 나머지는 비워서 제공하고,
 * 수정 화면은 기존 값으로 시드해 통째로 제공한다. 어느 쪽이든 필드 컴포넌트는
 * 자기가 어느 화면에 있는지 몰라도 된다.
 */
export type SubscribeContextValue = {
  category: SubscribeCategory | null;
  onChangeCategory: (value: SubscribeCategory) => void;
  service: string | null;
  /**
   * 카탈로그에서 고른 서비스의 불변 code. 직접 입력한 서비스는 null이다.
   * 이름과 함께 서버로 보내 로고 조회의 키가 된다.
   */
  serviceCode: string | null;
  onChangeService: (value: string, code?: string | null) => void;
  billingCycle: BillingCycle | null;
  onChangeBillingCycle: (value: BillingCycle) => void;
  price: number | null;
  onChangePrice: (value: number | null) => void;
  paymentDate: Date | null;
  // DateInput은 선택 해제를 지원하므로 null도 받는다.
  onChangePaymentDate: (value: Date | null) => void;
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
