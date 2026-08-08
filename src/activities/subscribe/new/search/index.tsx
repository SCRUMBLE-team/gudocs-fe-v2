import { Suspense, useDeferredValue, useState } from "react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { List, ListItem } from "@astryxdesign/core/List";
import { Spinner } from "@astryxdesign/core/Spinner";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { PencilIcon } from "../../../../components/service-picker/category-icons";
import SearchField from "../../../../components/service-picker/search-field";
import { searchServices } from "../../../../components/service-picker/search-services";
import ServiceRow from "../../../../components/service-picker/service-row";
import type { ServiceSelection } from "../../../../components/service-picker/types";
import {
  CATEGORY_META,
  isSubscribeCategory,
} from "../../../../constants/category";
import { useCatalogQuery } from "../../../../hooks/query/useCatalogQuery";
import { useGoBack } from "../../../../hooks/useGoBack";
import type { SubscribeCategory } from "../../../../types/subscribe";
import { useFunnelFlow } from "../use-funnel-flow";

type ServiceListProps = {
  category: SubscribeCategory | null;
  query: string;
  onSelect: (selection: ServiceSelection) => void;
};

/** 전체 검색과 카테고리 검색이 함께 쓰는 서비스 목록. */
function ServiceList({ category, query, onSelect }: ServiceListProps) {
  const { data: catalog } = useCatalogQuery();
  const services = searchServices(
    catalog.services,
    query,
    category ?? undefined,
  );
  const keyword = query.trim();

  if (services.length === 0) {
    return (
      <VStack paddingBlock={6} align="center">
        <Text color="secondary">
          {keyword
            ? `'${keyword}' 검색 결과가 없어요`
            : "등록 가능한 서비스가 없어요"}
        </Text>
      </VStack>
    );
  }

  return (
    <List density="spacious" hasDividers>
      {services.map((service) => (
        <ServiceRow
          key={service.id}
          label={service.label}
          selection={service.selection}
          onSelect={onSelect}
        />
      ))}
    </List>
  );
}

/**
 * 전체 서비스 검색과 카테고리별 서비스 탐색이 함께 쓰는 선택 화면.
 * 진입 경로에 따라 category 필터만 달라지고 헤더·검색창·목록 행은 동일하다.
 */
const SubscribeNewSearchActivity: StaticActivityComponentType<
  "SubscribeNewSearch"
> = ({ params }) => {
  const { push } = useFlow();
  const goBack = useGoBack();
  const { pushPay } = useFunnelFlow();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const category = isSubscribeCategory(params.category)
    ? params.category
    : null;
  const shouldShowServiceList = category != null || query.trim() !== "";
  const listTitle = category
    ? `${CATEGORY_META[category].label} 서비스`
    : "검색 결과";

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
          <Text type="body" weight="bold" className="flex-1 text-center">
            서비스 검색
          </Text>
          <VStack className="w-8 shrink-0" />
        </HStack>

        <VStack paddingInline={4} paddingBlock={2} gap={4}>
          <SearchField
            label="서비스 이름"
            placeholder="서비스 이름을 검색해보세요…"
            value={query}
            onChange={setQuery}
            autoFocus={category == null}
          />

          {shouldShowServiceList ? (
            <VStack gap={2}>
              <Text type="body" weight="bold">
                {listTitle}
              </Text>
              <Suspense
                fallback={
                  <VStack align="center" paddingBlock={10}>
                    <Spinner size="lg" />
                  </VStack>
                }
              >
                <ServiceList
                  category={category}
                  query={deferredQuery}
                  onSelect={pushPay}
                />
              </Suspense>
            </VStack>
          ) : null}

          <VStack gap={2}>
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

export default SubscribeNewSearchActivity;
