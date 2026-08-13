import type { MonthlyDetailData } from "../types/expenses";
import type { SubscribeCategory } from "../types/subscribe";
import { isListed, isPausedInMonth } from "./expenses";

/** 정리 시뮬레이터 한 줄. 화면이 그리는 데 필요한 값만 남긴다. */
export type SavingsRow = {
  subscriptionId: number;
  serviceName: string;
  /** 카탈로그 code. 로고 조회 키. 직접 입력한 서비스는 null이다. */
  serviceCode: string | null;
  category: SubscribeCategory;
  categoryName: string;
  /** 월 환산 금액. 연간 구독도 12로 나눈 값이라 한 줄에서 바로 비교된다. */
  monthlyAmount: number;
  /** 일시정지된 구독. 이미 돈이 안 나가므로 선택 대상에서 뺀다. */
  isPaused: boolean;
};

export type SavingsSummary = {
  /** 지금 매달 나가는 구독료. 일시정지를 뺀 활성 구독의 합. */
  baseAmount: number;
  /** 선택한 구독의 월 환산 합계 = 아끼는 돈. */
  savedAmount: number;
  /** 정리하고 남는 돈. */
  remainingAmount: number;
  /** 절감액을 1년으로 환산한 값. 체감을 키우려고 같이 보여준다. */
  yearlySavedAmount: number;
};

/**
 * 월별 상세 응답을 시뮬레이터 행으로 정규화한다.
 *
 * 삭제분은 isListed로 걸러낸다. 일시정지는 목록에 남겨두고 흐리게 그린다
 * (지출 상세·구독 목록과 같은 규칙).
 */
export function buildSavingsRows(
  subscriptions: MonthlyDetailData["subscriptions"],
): SavingsRow[] {
  return subscriptions.filter(isListed).map((item) => ({
    subscriptionId: item.subscriptionId,
    serviceName: item.serviceName,
    serviceCode: item.serviceCode,
    category: item.category,
    categoryName: item.categoryName,
    monthlyAmount: item.appliedMonthlyAmount,
    isPaused: isPausedInMonth(item),
  }));
}

/**
 * 기준 총액을 서버 totalAmount가 아니라 행 합계로 직접 계산하는 이유.
 *
 * 시뮬레이터는 `남는 금액 = 총액 - 선택 합계`가 산술적으로 항상 맞아야 한다.
 * 서버 totalAmount가 일시정지 구독을 포함하는지 확실하지 않아서 그대로 쓰면
 * 체크를 다 풀었을 때 숫자가 안 맞아 보일 수 있다. 홈 카드와 소수점 단위로
 * 어긋나는 것보다 이 화면 안에서 앞뒤가 맞는 쪽이 낫다.
 */
export function summarizeSavings(
  rows: SavingsRow[],
  selectedIds: ReadonlySet<number>,
): SavingsSummary {
  let baseAmount = 0;
  let savedAmount = 0;

  for (const row of rows) {
    if (row.isPaused) continue;
    baseAmount += row.monthlyAmount;
    if (selectedIds.has(row.subscriptionId)) savedAmount += row.monthlyAmount;
  }

  return {
    baseAmount,
    savedAmount,
    remainingAmount: baseAmount - savedAmount,
    yearlySavedAmount: savedAmount * 12,
  };
}
