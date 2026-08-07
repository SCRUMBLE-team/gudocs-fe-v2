import type { ApiResponse } from "../types/api";
import type { CatalogData } from "../types/catalog";
import { http } from "./httpClient";

/**
 * 구독 서비스 카탈로그. 서비스 목록·요금제의 단일 소스라 프론트는 목록을 따로 들지 않는다.
 * 프론트가 가지는 건 code로 이름 붙인 로고 이미지뿐이다.
 */
export async function getCatalog() {
  const response = await http.get<ApiResponse<CatalogData>>(
    "/api/subscriptions/catalog",
  );
  return response.data;
}
