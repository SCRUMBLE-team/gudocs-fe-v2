import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

/**
 * 서비스 워커에도 같은 값을 넘겨야 해서 config를 따로 내보낸다.
 * public/firebase-messaging-sw.js는 번들을 거치지 않아 import.meta.env를
 * 못 읽으므로, 등록 시 이 객체를 쿼리스트링으로 직렬화해 전달한다.
 */
export const firebaseConfig: Required<
  Pick<
    FirebaseOptions,
    | "apiKey"
    | "authDomain"
    | "projectId"
    | "storageBucket"
    | "messagingSenderId"
    | "appId"
  >
> = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Installations(FID 발급)에도 같은 app 인스턴스가 필요해서 내보낸다.
export const app = initializeApp(firebaseConfig);

let messagingPromise: Promise<Messaging | null> | undefined;

/**
 * 브라우저가 FCM을 지원할 때만 Messaging 인스턴스를 만든다.
 *
 * getMessaging()은 미지원 환경에서 throw하므로 isSupported()를 반드시 먼저
 * 통과시켜야 한다. 실제로 걸리는 경우가 많다 — iOS 16.4 미만 Safari,
 * 홈 화면에 설치되지 않은 iOS Safari 탭, 시크릿 모드 등.
 *
 * 결과는 캐시한다. isSupported()는 매번 호출하면 비용이 있고,
 * initializeApp된 app에 대한 Messaging은 어차피 싱글턴이다.
 */
export function getMessagingIfSupported() {
  messagingPromise ??= isSupported().then((supported) =>
    supported ? getMessaging(app) : null,
  );
  return messagingPromise;
}
