import { useMutation } from "@tanstack/react-query";
import { scanSubscriptionImage } from "../../api/ocr";

/**
 * 구독 결제 이미지 OCR 인식 뮤테이션.
 *
 * 서버 상태를 바꾸지 않고 읽기만 하므로 무효화할 쿼리가 없다.
 */
export function useScanSubscriptionImageMutation() {
  return useMutation({ mutationFn: scanSubscriptionImage });
}
