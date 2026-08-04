import { useMutation } from "@tanstack/react-query";
import { registerPushDevice } from "../../api/push-registrations";

/**
 * 이 기기를 푸시 수신 대상으로 등록한다.
 *
 * 무효화할 캐시가 없어서 onSuccess가 없다. 서버가 등록 정보를 어디에 쓰든
 * 클라이언트가 조회하는 데이터와는 무관하다.
 */
export function useRegisterPushMutation() {
  return useMutation({ mutationFn: registerPushDevice });
}
