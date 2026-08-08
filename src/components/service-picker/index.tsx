import { useState } from "react";
import { VStack } from "@astryxdesign/core/VStack";
import { Text } from "@astryxdesign/core/Text";
import { Icon } from "@astryxdesign/core/Icon";
import { List, ListItem } from "@astryxdesign/core/List";
import { useCatalogQuery } from "../../hooks/query/useCatalogQuery";
import type { SubscribeCategory } from "../../types/subscribe";
import { PencilIcon } from "./category-icons";
import CategorySelectField from "./category-select-field";
import SearchField from "./search-field";
import { searchServices } from "./search-services";
import ServiceRow from "./service-row";
import type { ServiceSelection } from "./types";

export type ServicePickerProps = {
  /** 서비스(또는 요금제)를 골랐을 때 */
  onSelect: (selection: ServiceSelection) => void;
  /** 목록에 없어 이름을 직접 입력하겠다고 할 때 */
  onCustom: () => void;
  /** 카테고리 안에서 서비스를 찾아볼 때 */
  onSelectCategory: (category: SubscribeCategory) => void;
};

type CustomServiceSectionProps = {
  onCustom: () => void;
};

function CustomServiceSection({ onCustom }: CustomServiceSectionProps) {
  return (
    <VStack gap={2}>
      <Text type="body" weight="bold">
        찾는 서비스가 없나요?
      </Text>
      <List density="spacious">
        <ListItem
          label="직접 입력하기"
          description="서비스 이름을 직접 적어 등록해요"
          startContent={<Icon icon={PencilIcon} size="lg" color="accent" />}
          endContent={<Icon icon="chevronRight" size="sm" />}
          onClick={onCustom}
        />
      </List>
    </VStack>
  );
}

/**
 * 서비스 고르기 본문. 검색이 먼저고 카테고리는 보조다.
 *
 * 이름을 알고 들어오는 사용자를 위해 검색을 맨 위에 둔다. 이름이 기억나지
 * 않는 경우에는 카테고리 탐색과 직접 입력으로 이어진다.
 *
 * 이름 검색은 이 화면 안에서 처리하고, 카테고리를 고른 경우에만 해당
 * 카테고리의 서비스 화면으로 이동한다. 이동은 전부 콜백으로 위임한다.
 */
function ServicePicker({
  onSelect,
  onCustom,
  onSelectCategory,
}: ServicePickerProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<SubscribeCategory | null>(null);
  const { data: catalog } = useCatalogQuery();
  const keyword = query.trim();
  const results = searchServices(catalog.services, query);

  return (
    <VStack gap={6}>
      <SearchField
        label="서비스 이름"
        placeholder="서비스 이름을 검색해보세요…"
        value={query}
        onChange={setQuery}
      />

      {keyword !== "" ? (
        results.length > 0 ? (
          <VStack gap={2}>
            <Text type="body" weight="bold">
              검색 결과
            </Text>
            <List density="spacious" hasDividers>
              {results.map((result) => (
                <ServiceRow
                  key={result.id}
                  label={result.label}
                  selection={result.selection}
                  onSelect={onSelect}
                />
              ))}
            </List>
          </VStack>
        ) : (
          <VStack gap={4}>
            <VStack paddingBlock={4} align="center">
              <Text color="secondary">{`'${keyword}' 검색 결과가 없어요`}</Text>
            </VStack>
            <CustomServiceSection onCustom={onCustom} />
          </VStack>
        )
      ) : (
        <VStack gap={6}>
          <VStack gap={2}>
            <Text type="body" weight="bold">
              카테고리로 찾기
            </Text>
            <CategorySelectField
              value={selectedCategory}
              placeholder="카테고리를 선택해주세요"
              onChange={(category) => {
                setSelectedCategory(category);
                onSelectCategory(category);
              }}
            />
          </VStack>

          <CustomServiceSection onCustom={onCustom} />
        </VStack>
      )}
    </VStack>
  );
}

export default ServicePicker;
