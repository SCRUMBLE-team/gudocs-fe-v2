/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;

  // Firebase 웹 앱 설정. 콘솔의 "웹 앱 구성"에서 그대로 가져온 값이고
  // 클라이언트에 노출되는 게 정상인 공개 값이다(비밀키가 아니다).
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  // 웹 푸시 인증서(콘솔 > 클라우드 메시징 > 웹 구성)의 공개키.
  readonly VITE_FIREBASE_VAPID_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
