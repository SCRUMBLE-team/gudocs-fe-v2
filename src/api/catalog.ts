import type { ApiResponse } from "../types/api";
import type {
  CatalogData,
  CatalogPlan,
  CatalogService,
} from "../types/catalog";
import { http } from "./httpClient";

/**
 * 구 카탈로그 응답과 새 응답이 배포 순서에 상관없이 함께 동작하도록 받는 형태.
 *
 * 구 서버는 selectable 대신 discontinued를 내려주고, 요금제에 approximate가 없다.
 * 이 값을 CatalogService로 바로 단언하면 selectable이 undefined라 모든 서비스가
 * 신규 등록 대상 필터에서 빠진다.
 */
type CatalogPlanResponse = Omit<CatalogPlan, "approximate"> & {
  approximate?: boolean;
};

type CatalogServiceResponse = Omit<
  CatalogService,
  "selectable" | "plans"
> & {
  selectable?: boolean;
  discontinued?: boolean;
  plans: CatalogPlanResponse[];
};

type CatalogDataResponse = Omit<CatalogData, "services"> & {
  services: CatalogServiceResponse[];
};

function normalizeCatalog(data: CatalogDataResponse): CatalogData {
  return {
    ...data,
    services: data.services.map(({ discontinued, ...service }) => ({
      ...service,
      // 새 계약을 우선하고, 없을 때만 구 계약의 반대값을 사용한다.
      selectable: service.selectable ?? !discontinued,
      plans: service.plans.map((plan) => ({
        ...plan,
        // 구 서버의 원화 요금제는 환산 추정치가 아니므로 false가 안전한 기본값이다.
        approximate: plan.approximate ?? false,
      })),
    })),
  };
}

/**
 * 구독 서비스 카탈로그. 서비스 목록·요금제의 단일 소스라 프론트는 목록을 따로 들지 않는다.
 * 프론트가 가지는 건 code로 이름 붙인 로고 이미지뿐이다.
 */
export async function getCatalog() {
  const response = await http.get<ApiResponse<CatalogDataResponse>>(
    "/api/subscriptions/catalog",
  );
  return normalizeCatalog(response.data);
}
