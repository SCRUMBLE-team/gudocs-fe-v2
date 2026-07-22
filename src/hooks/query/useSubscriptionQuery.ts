import { useSuspenseQuery } from "@tanstack/react-query";
import { getSubscriptionById } from "../../api/subscribe";

/** 구독 단건 상세. 상세/수정 화면에서 사용한다. */
export function useSubscriptionQuery(id: string) {
  return useSuspenseQuery({
    queryKey: ["subscription", id],
    queryFn: () => getSubscriptionById(id),
  });
}
