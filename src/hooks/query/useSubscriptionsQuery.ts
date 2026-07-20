import { useQuery } from "@tanstack/react-query";
import { getSubscriptions } from "../../api/subscribe";
import type { SubscribeCategory, SubscribeStatus } from "../../types/subscribe";

export function useSubscriptionsQuery(params: {
  category?: SubscribeCategory;
  status?: SubscribeStatus;
}) {
  return useQuery({
    queryKey: ["subscriptions", params],
    queryFn: () => getSubscriptions(params),
  });
}
