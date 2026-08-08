import { useFlow, useStack } from "@stackflow/react";
import type { ServiceSelection } from "../../../components/service-picker/types";
import type { SubscribeCategory } from "../../../types/subscribe";

/** 등록 퍼널의 첫 화면. 등록을 마치면 여기까지 통째로 걷어낸다. */
const FUNNEL_ROOT = "SubscribeNewStart";

/**
 * 등록 퍼널의 이동을 한 곳에 모은다.
 *
 * 서비스를 고르는 경로가 여럿이라(검색 / 카테고리 목록 / 직접 입력) 화면마다
 * 다음 화면으로 넘기는 코드가 흩어지기 쉽다. 특히 등록
 * 완료 후 걷어낼 깊이는 어느 경로로 왔느냐에 따라 3이 되기도 4가 되기도 해서,
 * 예전처럼 상수로 박아두면 경로가 하나 늘 때마다 조용히 틀어진다.
 */
export function useFunnelFlow() {
  const { push, pop } = useFlow();
  const stack = useStack();

  return {
    /** 선택한 카테고리의 서비스 검색 화면을 연다. */
    pushSearch(category: SubscribeCategory) {
      push("SubscribeNewSearch", { category });
    },

    /** 카탈로그에 없는 서비스의 이름 입력 화면을 연다. */
    pushCustom(category?: SubscribeCategory) {
      push("SubscribeNewCustom", category ? { category } : {});
    },

    /** 고른 서비스로 정보 입력 화면을 연다. */
    pushPay(selection: ServiceSelection) {
      push("SubscribeNewPay", {
        category: selection.category,
        service: selection.name,
        // 직접 입력한 서비스는 code가 없다. undefined면 URL에 실리지 않는다.
        ...(selection.code ? { serviceCode: selection.code } : {}),
      });
    },

    /** 등록을 마치고 퍼널 전체를 닫아 띄운 화면으로 돌아간다. */
    closeFunnel() {
      // 빠져나가는 중인 화면은 이미 스택에서 걷히는 중이라 세지 않는다.
      const alive = stack.activities.filter(
        (activity) => !activity.transitionState.startsWith("exit"),
      );
      const rootIndex = alive.findLastIndex(
        (activity) => activity.name === FUNNEL_ROOT,
      );

      // 첫 화면을 못 찾는 건 주소로 곧장 들어온 경우다. 그때는 한 장만 닫는다.
      pop(rootIndex === -1 ? 1 : alive.length - rootIndex);
    },
  };
}
