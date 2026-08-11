import type { ApiResponse } from "../types/api";
import type {
  CreateSubscribePayload,
  SubscriptionDetail,
  SubscribeCategory,
  SubscribeStatus,
} from "../types/subscribe";
import { http } from "./httpClient";

export async function createSubscriptions(data: CreateSubscribePayload) {
  const response = await http.post<ApiResponse<SubscriptionDetail>>(
    "/api/subscriptions",
    data,
  );
  return response.data;
}

export async function getSubscriptions({
  category,
  status,
}: {
  category?: SubscribeCategory;
  status?: SubscribeStatus;
}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (status) params.set("status", status);

  const response = await http.get<ApiResponse<SubscriptionDetail[]>>(
    `/api/subscriptions?${params}`,
  );
  return response.data;
}

export async function getSubscriptionById(subscriptionId: string) {
  const response = await http.get<ApiResponse<SubscriptionDetail>>(
    `/api/subscriptions/${subscriptionId}`,
  );
  return response.data;
}

export async function editSubscription({
  subscriptionId,
  data,
}: {
  subscriptionId: string;
  data: CreateSubscribePayload;
}) {
  const response = await http.put<ApiResponse<SubscriptionDetail>>(
    `/api/subscriptions/${subscriptionId}`,
    data,
  );
  return response.data;
}

export async function deleteSubscription(subscriptionId: string) {
  const response = await http.delete<ApiResponse<{ data: null }>>(
    `/api/subscriptions/${subscriptionId}`,
  );
  return response.data;
}

export async function changeSubscribeStatus({
  subscriptionId,
  status,
}: {
  subscriptionId: string;
  status: SubscribeStatus;
}) {
  const response = await http.put<ApiResponse<SubscriptionDetail>>(
    `/api/subscriptions/${subscriptionId}/status`,
    {
      status,
    },
  );
  return response.data;
}

export async function savingsSelection({
  subscriptionIds,
}: {
  subscriptionIds: number[];
}) {
  const response = await http.put<ApiResponse<{ data: SubscriptionDetail[] }>>(
    "/api/subscriptions/savings-selection",
    {
      subscriptionIds,
    },
  );
  return response.data;
}
