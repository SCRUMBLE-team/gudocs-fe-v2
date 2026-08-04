import { useMutation } from "@tanstack/react-query";
import { unregisterPushDevice } from "../../api/push-registrations";

/** 이 기기의 푸시 등록을 비활성화한다. */
export function useUnregisterPushMutation() {
  return useMutation({ mutationFn: unregisterPushDevice });
}
