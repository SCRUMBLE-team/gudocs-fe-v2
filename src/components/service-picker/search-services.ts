import type { CatalogService } from "../../types/catalog";
import type { ServiceSelection } from "./types";

export type ServiceSearchResult = {
  /** 카탈로그의 불변 서비스 code. */
  id: string;
  label: string;
  selection: ServiceSelection;
};

/** 공백과 대소문자를 지운 비교용 문자열. "You Tube"와 "youtube"를 같게 본다. */
function normalize(value: string) {
  return value.replace(/\s+/g, "").toLowerCase();
}

/**
 * 검색어로 카탈로그를 훑어 고를 수 있는 행들을 만든다.
 *
 * 표시명과 code 양쪽을 본다. 표시명은 한글("넷플릭스")이고 code는 영문
 * UPPER_SNAKE("NETFLIX")라, 둘 다 보면 "넷플"로도 "netflix"로도 걸린다.
 * 검색 결과는 서비스마다 한 행만 만든다. 요금제는 서비스를 고른 다음 화면에서
 * 확인하고 변경한다.
 */
export function searchServices(
  services: readonly CatalogService[],
  query: string,
): ServiceSearchResult[] {
  const keyword = normalize(query);

  if (keyword === "") {
    return [];
  }

  const results: ServiceSearchResult[] = [];

  for (const service of services) {
    // 신규 등록 대상이 아닌 서비스는 검색에서도 뺀다. 과거 영수증 OCR 인식용으로
    // 카탈로그에 남아 있을 뿐이라, 골라봤자 서버가 400으로 막는다.
    if (!service.selectable) {
      continue;
    }

    const isHit =
      normalize(service.name).includes(keyword) ||
      // code의 밑줄은 사용자가 칠 일이 없으니 지우고 본다(YOUTUBE_PREMIUM → youtubepremium).
      normalize(service.code.replace(/_/g, "")).includes(keyword);

    if (!isHit) {
      continue;
    }

    results.push({
      id: service.code,
      label: service.name,
      selection: {
        code: service.code,
        name: service.name,
        category: service.category,
      },
    });
  }

  return results;
}
