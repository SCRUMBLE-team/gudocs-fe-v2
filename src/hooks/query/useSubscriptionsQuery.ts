import { useSuspenseQuery } from "@tanstack/react-query";
import { getSubscriptions } from "../../api/subscribe";
import type { SubscribeCategory, SubscribeStatus } from "../../types/subscribe";

export function useSubscriptionsQuery(params: {
  category?: SubscribeCategory;
  status?: SubscribeStatus;
}) {
  return useSuspenseQuery({
    queryKey: ["subscriptions", params],
    queryFn: () => getSubscriptions(params),
  });
}
