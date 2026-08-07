import { useSuspenseQuery } from "@tanstack/react-query";
import { getCatalog } from "../../api/catalog";

/**
 * 서비스 카탈로그.
 *
 * 배포마다 바뀌는 정적 데이터라 세션 동안 다시 받을 이유가 없다.
 * 등록 화면과 로고 조회가 같이 쓰므로 캐시를 공유한다.
 */
export function useCatalogQuery() {
  return useSuspenseQuery({
    queryKey: ["subscriptions", "catalog"],
    queryFn: getCatalog,
    staleTime: Infinity,
  });
}
