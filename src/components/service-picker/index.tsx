import { useState } from "react";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { Icon } from "@astryxdesign/core/Icon";
import { List, ListItem } from "@astryxdesign/core/List";
import { CATEGORY_META } from "../../constants/category";
import { POPULAR_SERVICE_CODES } from "../../constants/popular-service";
import { useCatalogQuery } from "../../hooks/query/useCatalogQuery";
import type { SubscribeCategory } from "../../types/subscribe";
import { searchServices } from "./search-services";
import { PencilIcon } from "./category-icons";
import PopularGrid from "./popular-grid";
import SearchField from "./search-field";
import ServiceRow from "./service-row";
import type { ServiceSelection } from "./types";

const CATEGORY_OPTIONS = Object.entries(CATEGORY_META).map(([code, meta]) => ({
  value: code as SubscribeCategory,
  label: meta.label,
}));

export type ServicePickerProps = {
  /** 서비스(또는 요금제)를 골랐을 때 */
  onSelect: (selection: ServiceSelection) => void;
  /** 목록에 없어 이름을 직접 입력하겠다고 할 때 */
  onCustom: () => void;
  /** 카테고리로 찾아보겠다고 할 때. 넘기지 않으면 카테고리 영역을 그리지 않는다. */
  onSelectCategory?: (category: SubscribeCategory) => void;
};

/**
 * 서비스 고르기 본문. 검색이 먼저고 카테고리는 보조다.
 *
 * 이름을 알고 들어오는 사용자가 압도적으로 많아서 검색을 맨 위에 둔다. 이름이
 * 기억나지 않는 사용자를 위해 자주 찾는 서비스와 카테고리를 아래에 깔아,
 * 검색어를 떠올리지 못해도 화면에서 막히지 않게 한다.
 *
 * 액티비티가 아니라 컴포넌트인 이유는 OCR 확인 화면에서 서비스를 다시 고를
 * 때도 같은 UI를 써야 해서다. 이동은 전부 콜백으로 위임한다.
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
  const results = searchServices(catalog.services, keyword);

  // 카탈로그에서 되짚는다. 상수에는 code만 있고 표시명·카테고리·요금제는
  // 카탈로그가 단일 소스라, 여기서 이름을 따로 들면 두 곳이 어긋난다.
  const popular = POPULAR_SERVICE_CODES.map((code) =>
    catalog.services.find((item) => item.code === code && item.selectable),
  )
    .filter((item) => item != null)
    .map((item) => ({
      code: item.code,
      name: item.name,
      category: item.category,
    }));

  return (
    <VStack gap={5}>
      <SearchField
        label="서비스 이름"
        placeholder="서비스 이름을 검색해보세요…"
        value={query}
        onChange={setQuery}
      />

      {keyword !== "" ? (
        <VStack gap={5}>
          {results.length === 0 ? (
            <VStack paddingBlock={4} align="center">
              <Text color="secondary">{`'${keyword}' 검색 결과가 없어요`}</Text>
            </VStack>
          ) : (
            <List density="spacious">
              {results.map((result) => (
                <ServiceRow
                  key={result.id}
                  label={result.label}
                  selection={result.selection}
                  onSelect={onSelect}
                />
              ))}
            </List>
          )}

          <VStack gap={2}>
            <Text type="body" weight="bold">
              이름이 다른가요?
            </Text>
            <List density="spacious">
              <ListItem
                label="직접 입력하기"
                description="결과에 없으면 이름을 직접 적어주세요"
                startContent={
                  <Icon icon={PencilIcon} size="lg" color="accent" />
                }
                endContent={<Icon icon="chevronRight" size="sm" />}
                onClick={onCustom}
              />
            </List>
          </VStack>
        </VStack>
      ) : (
        <VStack gap={5}>
          <VStack gap={2}>
            <Text type="body" weight="bold">
              자주 찾는 서비스
            </Text>
            <PopularGrid services={popular} onSelect={onSelect} />
          </VStack>

          {onSelectCategory && (
            <VStack gap={2}>
              <Text type="body" weight="bold">
                카테고리로 찾기
              </Text>
              <HStack
                as="nav"
                aria-label="구독 서비스 카테고리"
                gap={2}
                className="overflow-x-auto overflow-y-hidden pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {CATEGORY_OPTIONS.map((category) => {
                  const isSelected = selectedCategory === category.value;

                  return (
                    <HStack
                      key={category.value}
                      as="button"
                      align="center"
                      paddingInline={3}
                      paddingBlock={2}
                      aria-pressed={isSelected}
                      onClick={() => {
                        setSelectedCategory(category.value);
                        onSelectCategory(category.value);
                      }}
                      className={`min-h-10 shrink-0 touch-manipulation rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${
                        isSelected
                          ? "border-[var(--color-accent)] bg-accent"
                          : "border-gray-300 bg-surface hover:bg-muted active:bg-muted"
                      }`}
                    >
                      <Text
                        type="supporting"
                        weight={isSelected ? "bold" : "medium"}
                        className={isSelected ? "text-on-accent" : undefined}
                      >
                        {category.label}
                      </Text>
                    </HStack>
                  );
                })}
              </HStack>
            </VStack>
          )}

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
                onClick={onCustom}
              />
            </List>
          </VStack>
        </VStack>
      )}
    </VStack>
  );
}

export default ServicePicker;
