/**
 * 토스 정적 에셋 CDN의 아이콘을 그대로 불러온다.
 *
 * TDS 패키지(@toss/tds-mobile)와는 무관한 공개 URL이라 라이선스 가드에
 * 걸리지 않는다. 다만 토스 자사 서비스용 CDN이므로 외부 사용에 대한
 * 가용성 보장은 없다 — 경로가 바뀌거나 hotlink 차단이 걸리면 조용히
 * 깨진다. 그때는 lucide-react 같은 오픈 아이콘 세트로 교체하면 된다.
 *
 * alt=""로 두는 이유: 아이콘 옆에 항상 텍스트 라벨이 함께 오므로
 * 스크린리더에는 중복 정보가 된다.
 */
const CDN_BASE = "https://static.toss.im/icons/svg";

export type AssetIconProps = {
  /** CDN의 아이콘 이름 (예: "icon-logo-youtube-red") */
  name: string;
  size?: number;
};

function AssetIcon({ name, size = 24 }: AssetIconProps) {
  return (
    <img
      src={`${CDN_BASE}/${name}.svg`}
      alt=""
      width={size}
      height={size}
      className="shrink-0"
      loading="lazy"
    />
  );
}

export default AssetIcon;
