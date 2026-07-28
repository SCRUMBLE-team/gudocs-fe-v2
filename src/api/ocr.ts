import type { ApiResponse } from "../types/api";
import type { OcrScanResult } from "../types/subscribe";
import { http } from "./httpClient";

/** 이미지 용량 상한 (10MB). 서버 스펙과 같은 값을 클라이언트에서도 막는다. */
export const MAX_OCR_IMAGE_BYTES = 10 * 1024 * 1024;

/** 서버가 받는 이미지 형식. input의 accept와 검증에 함께 쓴다. */
export const ACCEPTED_OCR_IMAGE_TYPES = ["image/jpeg", "image/png"];

/**
 * 구독 결제 이미지를 올려 필드를 인식한다.
 *
 * baseFetch가 FormData를 감지해 Content-Type을 비워두므로(브라우저가 boundary를
 * 붙여야 한다) 여기서 헤더를 넘기면 안 된다.
 */
export async function scanSubscriptionImage(image: File) {
  const formData = new FormData();
  formData.append("image", image);

  const response = await http.post<ApiResponse<OcrScanResult>>(
    "/api/ocr/subscriptions/scan",
    formData,
  );
  return response.data;
}
