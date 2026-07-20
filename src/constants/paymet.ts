import type { BillingCycle, PaymentMethod } from "../types/subscribe";

export const BILLING_CYCLE_META: Record<BillingCycle, { label: string }> = {
  MONTHLY: { label: "월간 결제" },
  YEARLY: { label: "연간 결제" },
};

export const PAYMENT_METHOD_META: Record<PaymentMethod, { label: string }> = {
  CARD: { label: "카드 결제" },
  BANK_TRANSFER: { label: "계좌이체" },
  SIMPLE_PAY: { label: "간편결제" },
  ETC: { label: "기타" },
};
