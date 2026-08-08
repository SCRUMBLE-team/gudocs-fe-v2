import { Icon } from "@astryxdesign/core/Icon";
import { ListItem } from "@astryxdesign/core/List";
import ServiceLogo from "../service-logo";
import type { ServiceSelection } from "./types";

export type ServiceRowProps = {
  /** 화면에 표시할 서비스명. */
  label: string;
  description?: string;
  selection: ServiceSelection;
  onSelect: (selection: ServiceSelection) => void;
};

/**
 * 고를 수 있는 서비스 한 줄. 검색 결과·자주 찾는 서비스·카테고리 목록이 함께 쓴다.
 * 세 곳의 생김새가 갈라지지 않게 ListItem 조립은 여기 한 곳에만 둔다.
 */
function ServiceRow({
  label,
  description,
  selection,
  onSelect,
}: ServiceRowProps) {
  return (
    <ListItem
      label={label}
      description={description}
      startContent={
        <ServiceLogo name={selection.name} code={selection.code} size={28} />
      }
      endContent={<Icon icon="chevronRight" size="sm" />}
      onClick={() => onSelect(selection)}
    />
  );
}

export default ServiceRow;
