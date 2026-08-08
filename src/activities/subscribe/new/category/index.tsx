import { Suspense } from "react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react";
import { useGoBack } from "../../../../hooks/useGoBack";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Spinner } from "@astryxdesign/core/Spinner";
import { List, ListItem } from "@astryxdesign/core/List";
import { PencilIcon } from "../../../../components/service-picker/category-icons";
import ServiceRow from "../../../../components/service-picker/service-row";
import type { ServiceSelection } from "../../../../components/service-picker/types";
import {
  CATEGORY_META,
  isSubscribeCategory,
} from "../../../../constants/category";
import { useCatalogQuery } from "../../../../hooks/query/useCatalogQuery";
import type { SubscribeCategory } from "../../../../types/subscribe";
import { useFunnelFlow } from "../use-funnel-flow";

type ServiceListProps = {
  category: SubscribeCategory;
  onSelect: (selection: ServiceSelection) => void;
};

/** 카탈로그를 읽는 부분만 떼어 Suspense 경계 안쪽에 둔다. */
function ServiceList({ category, onSelect }: ServiceListProps) {
  const { data: catalog } = useCatalogQuery();

  // 종료됐거나 단독 결제 상품이 아닌 서비스는 뺀다. 과거 영수증 OCR 인식용으로
  // 카탈로그에 남아 있을 뿐 새로 등록할 수 있는 대상이 아니다.
  const services = catalog.services.filter(
    (item) => item.category === category && item.selectable,
  );

  // ETC처럼 카탈로그에 서비스가 없는 카테고리도 있다. 그때는 빈 목록 대신 아래
  // 직접 입력만 남는데, 그게 이 카테고리에서 할 수 있는 전부라 맞다.
  return (
    <List density="spacious">
      {services.map((service) => (
        <ServiceRow
          key={service.code}
          label={service.name}
          selection={{
            code: service.code,
            name: service.name,
            category: service.category,
          }}
          onSelect={onSelect}
        />
      ))}
    </List>
  );
}

/**
 * 카테고리 하나의 서비스 목록.
 *
 * 서비스 이름이 기억나지 않아 검색을 못 하는 사용자를 위한 우회로다. 여기서
 * 고른 서비스도 검색으로 고른 것과 똑같이 정보 입력 화면으로 이어진다.
 */
const SubscribeNewCategoryActivity: StaticActivityComponentType<
  "SubscribeNewCategory"
> = ({ params }) => {
  const { push } = useFlow();
  const goBack = useGoBack();
  const { pushPay } = useFunnelFlow();

  // 주소창을 거쳐 들어오는 값이라 아는 카테고리인지 확인한다. 모르는 값이면
  // 목록을 그리지 않고 직접 입력만 남긴다 — 실수로 열린 화면에서도 사용자가
  // 할 수 있는 일이 하나는 있어야 한다.
  const category = isSubscribeCategory(params.category)
    ? params.category
    : null;
  const title = category
    ? `${CATEGORY_META[category].label} 서비스 중에 있나요?`
    : "어떤 서비스를 구독하고 있나요?";

  return (
    <AppScreen>
      <VStack minHeight="100%">
        <HStack paddingInline={2} paddingBlock={2} align="center">
          <IconButton
            label="뒤로 가기"
            icon={<Icon icon="chevronLeft" />}
            variant="ghost"
            onClick={goBack}
          />
        </HStack>

        <VStack paddingInline={4} paddingBlock={2} gap={5}>
          <Heading level={2}>{title}</Heading>

          {category && (
            <Suspense
              fallback={
                <VStack align="center" paddingBlock={10}>
                  <Spinner size="lg" />
                </VStack>
              }
            >
              <ServiceList category={category} onSelect={pushPay} />
            </Suspense>
          )}

          <VStack gap={1}>
            <Text type="body" weight="bold">
              찾는 서비스가 없나요?
            </Text>
            <List density="spacious">
              <ListItem
                label="직접 입력하기"
                description="서비스 이름을 직접 적어 등록해요"
                startContent={
                  <Icon icon={PencilIcon} size="lg" color="accent" />
                }
                endContent={<Icon icon="chevronRight" size="sm" />}
                // 이 카테고리를 미리 채워 넘긴다. 방금 고르고 들어온 값을
                // 다음 화면에서 또 고르게 하면 뒤로 가기와 구분이 안 된다.
                onClick={() =>
                  push("SubscribeNewCustom", category ? { category } : {})
                }
              />
            </List>
          </VStack>
        </VStack>
      </VStack>
    </AppScreen>
  );
};

export default SubscribeNewCategoryActivity;
