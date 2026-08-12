import { useState } from "react";
import { Banner } from "@astryxdesign/core/Banner";
import { List, ListItem, Text } from "@astryxdesign/core";
import { useFlow } from "@stackflow/react";
import ServiceLogo from "../../components/service-logo";
import { useSubscriptionsQuery } from "../../hooks/query/useSubscriptionsQuery";
import type { PriceChange } from "../../types/subscribe";
import { daysUntil, formatMonthDay } from "../../utils/date";
import { formatWon } from "../../utils/format";

/**
 * 닫은 배너를 기억한다. (expenses의 use-coach-mark, push의 gudocs.* 와 같은 방식)
 *
 * 값으로 "본 적 있음" 플래그 대신 변경 목록의 시그니처를 저장한다. 새 인상 공지가
 * 붙거나 적용일이 바뀌면 시그니처가 달라져서 한 번 더 뜨고, 같은 내용이면 계속 숨는다.
 */
const STORAGE_KEY = "gudocs.priceChange.dismissed.v1";

function readDismissed(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    // 시크릿 모드 등에서 localStorage가 막혀 있으면 닫은 적 없는 것으로 친다.
    // 코치마크와 반대 방향이다. 결제 금액이 바뀐다는 안내는 매번 뜨는 쪽이 낫다.
    return null;
  }
}

type PriceChangeRow = {
  id: number;
  serviceName: string;
  serviceCode: string | null;
  change: PriceChange;
};

/**
 * 구독료 변경 예고 배너.
 *
 * 등록해둔 금액과 실제로 빠져나갈 금액이 달라지는 상황이라 홈 최상단에 둔다.
 * 예고가 하나도 없으면 아무것도 그리지 않는다.
 */
function PriceChangeBanner() {
  const { push } = useFlow();
  const { data } = useSubscriptionsQuery({});

  /*
   * flatMap으로 걸러야 priceChange가 PriceChange로 좁혀진다. filter로는 배열
   * 원소 타입이 그대로 남아서 아래에서 매번 null 체크를 해야 한다.
   *
   * 일시정지된 구독은 결제가 나가지 않으니 가격이 올라도 당장 손해가 없다.
   * (결제 일정 카드가 PAUSED를 빼는 것과 같은 이유)
   * 이미 적용일이 지난 변경도 뺀다. 알려서 막을 수 있는 게 없다.
   */
  const changes: PriceChangeRow[] = data
    .flatMap((item) =>
      item.priceChange && item.status !== "PAUSED"
        ? [
            {
              id: item.id,
              serviceName: item.serviceName,
              serviceCode: item.serviceCode,
              change: item.priceChange,
            },
          ]
        : [],
    )
    .filter((row) => daysUntil(row.change.effectiveOn) > 0)
    // "YYYY-MM-DD"라 문자열 비교만으로 날짜순이 된다. 곧 바뀌는 것부터 보여준다.
    .sort((a, b) => a.change.effectiveOn.localeCompare(b.change.effectiveOn));

  const signature = changes
    .map((row) => `${row.id}:${row.change.effectiveOn}`)
    .join("|");

  // effect로 켜면 첫 페인트에 한 번 깜빡인다. 초기값에서 바로 결정한다.
  const [dismissed, setDismissed] = useState(readDismissed);

  if (changes.length === 0 || signature === dismissed) return null;

  function handleDismiss() {
    setDismissed(signature);
    try {
      localStorage.setItem(STORAGE_KEY, signature);
    } catch {
      // 저장이 안 되면 다음 방문에 한 번 더 뜨는 정도라 무시한다.
    }
  }

  return (
    <Banner
      status="warning"
      title="구독료가 바뀌는 서비스가 있어요"
      description={`${changes.length}개 서비스의 가격이 곧 달라져요`}
      isDismissable
      onDismiss={handleDismiss}
      defaultIsExpanded
    >
      <List density="compact">
        {changes.map((row) => {
          const { oldPrice, newPrice, effectiveOn } = row.change;
          // 인상은 빨강, 인하는 accent. 지출 비교 문구(ChangeText)와 같은 토큰을 쓴다.
          const amountColor =
            newPrice > oldPrice
              ? "text-[var(--color-text-red)]"
              : "text-[var(--color-accent)]";

          return (
            <ListItem
              key={row.id}
              onClick={() => push("SubscribeDetail", { id: String(row.id) })}
              className="p-0 py-1"
              startContent={
                <ServiceLogo name={row.serviceName} code={row.serviceCode} />
              }
              label={
                <Text type="body" weight="semibold">
                  {row.serviceName}
                </Text>
              }
              description={
                <Text type="supporting" weight="semibold" color="secondary">
                  {formatWon(oldPrice)} →{" "}
                  <Text
                    type="supporting"
                    weight="bold"
                    color="inherit"
                    className={amountColor}
                  >
                    {formatWon(newPrice)}
                  </Text>
                </Text>
              }
              endContent={
                <Text type="supporting" color="secondary">
                  {formatMonthDay(effectiveOn)}부터
                </Text>
              }
            />
          );
        })}
      </List>
    </Banner>
  );
}

export default PriceChangeBanner;
