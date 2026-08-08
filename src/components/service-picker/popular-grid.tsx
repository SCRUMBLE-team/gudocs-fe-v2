import { Grid } from "@astryxdesign/core/Grid";
import { VStack } from "@astryxdesign/core/VStack";
import { Text } from "@astryxdesign/core/Text";
import ServiceLogo from "../service-logo";
import type { ServiceSelection } from "./types";

export type PopularGridProps = {
  services: readonly ServiceSelection[];
  onSelect: (selection: ServiceSelection) => void;
};

/**
 * 자주 찾는 서비스. 로고를 알아보고 누르는 자리라 목록이 아니라 격자로 둔다.
 *
 * 카드로 감싸지 않는 이유는 로고 자체가 이미 경계를 가진 사각형이라서다.
 * 테두리를 한 겹 더 두르면 로고 여섯 개가 여섯 개의 상자로 읽혀 화면이
 * 빽빽해진다. 구분은 여백만으로 한다.
 */
function PopularGrid({ services, onSelect }: PopularGridProps) {
  return (
    <Grid columns={3} gap={2}>
      {services.map((service) => (
        <VStack
          key={service.code}
          as="button"
          align="center"
          gap={1}
          paddingBlock={0.5}
          width="100%"
          onClick={() => onSelect(service)}
          className="min-w-0 touch-manipulation rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <ServiceLogo name={service.name} code={service.code} size={52} />
          {/* 이름이 긴 서비스(유튜브 프리미엄)는 두 줄까지 허용한다. 한 줄로
              자르면 같은 브랜드의 요금제끼리 구분이 안 된다. */}
          <Text type="supporting" className="line-clamp-2 text-center">
            {service.name}
          </Text>
        </VStack>
      ))}
    </Grid>
  );
}

export default PopularGrid;
