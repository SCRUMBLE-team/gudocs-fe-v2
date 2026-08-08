import type { CatalogPlan } from "../../types/catalog";
import { useCatalogQuery } from "./useCatalogQuery";

const EMPTY_PLANS: readonly CatalogPlan[] = [];

/** 서비스 code에 해당하는 카탈로그 요금제. 직접 입력 서비스면 빈 목록이다. */
export function useCatalogPlans(serviceCode: string | null | undefined) {
  const { data: catalog } = useCatalogQuery();

  if (!serviceCode) {
    return EMPTY_PLANS;
  }

  return (
    catalog.services.find((service) => service.code === serviceCode)?.plans ??
    EMPTY_PLANS
  );
}
