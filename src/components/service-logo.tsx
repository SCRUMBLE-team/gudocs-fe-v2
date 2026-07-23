import { Avatar } from "@astryxdesign/core/Avatar";
import { getServiceLogo } from "../constants/category";

export type ServiceLogoProps = {
  /** 로고를 조회할 서비스명. Avatar 이니셜에도 쓰인다. */
  name: string;
  /** name으로 로고를 못 찾을 때 대신 조회할 이름 (예: 서버의 service 필드) */
  fallbackName?: string;
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
function ServiceLogo({ name, fallbackName, size = 36 }: ServiceLogoProps) {
  const logo = getServiceLogo(name) ?? getServiceLogo(fallbackName);

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
