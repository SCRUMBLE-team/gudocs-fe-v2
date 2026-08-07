import { Avatar } from "@astryxdesign/core/Avatar";
import { getServiceLogo } from "../constants/category";

export type ServiceLogoProps = {
  /** Avatar 이니셜에 쓰는 표시명. 로고를 찾는 키는 아니다. */
  name: string;
  /**
   * 카탈로그 code. 로고를 찾는 유일한 키다.
   * 직접 입력한 서비스는 null이라 로고가 없고, 이니셜 Avatar로 대체된다.
   */
  code: string | null;
  /** 정사각형 한 변의 px. 기본 36. */
  size?: number;
};

/** px 크기를 로고가 없을 때 쓰는 Avatar의 명명 사이즈로 매핑한다. */
function avatarSize(px: number) {
  if (px <= 20) return "tiny" as const;
  if (px <= 28) return "xsmall" as const;
  if (px <= 40) return "small" as const;
  if (px <= 56) return "medium" as const;
  return "large" as const;
}

/**
 * 서비스 로고 이미지. 등록된 로고가 없으면 이니셜 Avatar로 대체한다.
 * 구독 목록·상세·소비 분석 등 서비스 아이콘이 필요한 곳에서 공용으로 쓴다.
 */
function ServiceLogo({ name, code, size = 36 }: ServiceLogoProps) {
  const logo = getServiceLogo(code);

  if (logo) {
    return (
      <img
        src={logo}
        alt=""
        className="shrink-0 rounded-lg object-contain"
        style={{ width: size, height: size }}
      />
    );
  }

  return <Avatar name={name} size={avatarSize(size)} />;
}

export default ServiceLogo;
