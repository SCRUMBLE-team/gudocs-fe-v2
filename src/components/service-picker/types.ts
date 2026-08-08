import type { SubscribeCategory } from "../../types/subscribe";

/**
 * 사용자가 고른 서비스. 등록 화면으로 그대로 넘어간다.
 *
 * 식별자는 이름이 아니라 code다. 표시명은 오타 수정·브랜드 변경으로 바뀌므로
 * 되찾기 키로 쓰면 엉뚱한 서비스가 걸린다(constants/category.ts 참고).
 */
export type ServiceSelection = {
  /** 카탈로그에 없는 서비스를 직접 입력한 경우에는 null이다. */
  code: string | null;
  name: string;
  category: SubscribeCategory;
};
