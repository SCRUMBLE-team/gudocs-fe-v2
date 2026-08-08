import type { ComponentType, SVGProps } from "react";
import type { CATEGORY_META } from "../../constants/category";
import {
  AiIcon,
  CloudIcon,
  DesignIcon,
  EducationIcon,
  EtcIcon,
  GameIcon,
  MusicIcon,
  NewsIcon,
  OttIcon,
  ProductivityIcon,
  ShoppingIcon,
} from "./category-icons";

/**
 * 카테고리 code → line 아이콘.
 *
 * 아이콘 컴포넌트들과 한 파일에 두면 fast refresh가 그 파일을 컴포넌트 모듈로
 * 보지 않아 편집할 때마다 화면이 통째로 새로고침된다. 그래서 상수만 떼어 둔다.
 */
export const CATEGORY_ICONS: Record<
  keyof typeof CATEGORY_META,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  OTT: OttIcon,
  MUSIC: MusicIcon,
  CLOUD: CloudIcon,
  PRODUCTIVITY: ProductivityIcon,
  AI: AiIcon,
  NEWS: NewsIcon,
  EDUCATION: EducationIcon,
  GAME: GameIcon,
  SHOPPING: ShoppingIcon,
  DESIGN: DesignIcon,
  ETC: EtcIcon,
};
