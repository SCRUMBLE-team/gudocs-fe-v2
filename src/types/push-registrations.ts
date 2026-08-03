/** 기기 토큰을 발급한 플랫폼. 웹뷰/PWA만 있어서 지금은 하나다. */
export type DevicePlatform = "WEB";

/** POST /api/push-registrations 요청 바디 */
export interface PushRegistrationPayload {
  fid: string;
  platform: DevicePlatform;
  deviceName: string;
}

/** POST /api/push-registrations 201 응답의 data */
export interface PushRegistration {
  registrationId: number;
  platform: DevicePlatform;
  enabled: boolean;
  updatedAt: string;
}
