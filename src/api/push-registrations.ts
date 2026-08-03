import type { ApiResponse } from "../types/api";
import type {
  PushRegistration,
  PushRegistrationPayload,
} from "../types/push-registrations";
import { http } from "./httpClient";

/**
 * 이 기기를 푸시 수신 대상으로 등록한다.
 *
 * 인증이 세션 쿠키 기반이라 바디에 userId가 없다. 서버가 세션에서 사용자를
 * 찾아 upsert하므로 같은 fid를 다시 보내도 행이 늘지 않고 enabled=true가 된다.
 */
export async function registerPushDevice(payload: PushRegistrationPayload) {
  const response = await http.post<ApiResponse<PushRegistration>>(
    "/api/push-registrations",
    payload,
  );
  return response.data;
}

/** 등록을 비활성화한다(enabled=false). 이미 비활성이어도 성공하는 멱등 API다. */
export async function unregisterPushDevice(registrationId: number) {
  const response = await http.delete<ApiResponse<string>>(
    `/api/push-registrations/${registrationId}`,
  );
  return response.data;
}
