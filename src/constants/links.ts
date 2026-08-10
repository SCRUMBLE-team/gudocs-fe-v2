/** 앱 밖으로 나가는 링크들. 화면 여기저기에 흩어지지 않게 한곳에 모은다. */

export const SUPPORT_EMAIL = "support@gudocs.app";

/**
 * 문의하기 메일.
 *
 * subject는 반드시 인코딩한다. 한글을 raw로 넣으면 메일 클라이언트에 따라
 * 제목이 깨지거나 mailto 파싱 자체가 실패한다.
 */
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
  "[Gudocs] 문의",
)}`;

/** TODO: 구글 설문지 URL이 나오면 교체 */
export const APP_REVIEW_FORM_URL = "https://forms.gle/REPLACE_ME";
