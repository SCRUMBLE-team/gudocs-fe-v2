import {
  Badge,
  Card,
  Icon,
  IconButton,
  List,
  ListItem,
} from "@astryxdesign/core";
import { useSubscriptionsQuery } from "../../hooks/query/useSubscriptionsQuery";
import EmptySubscription from "./empty-subscription";
import { Text } from "@astryxdesign/core/Text";
import ServiceLogo from "../../components/service-logo";
import { formatWon } from "../../utils/format";
import { daysSince } from "../../utils/date";
import { useFlow } from "@stackflow/react";

/** 이 일수 이하로 남으면 D-day를 빨강으로 띄운다. */
const IMMINENT_DAYS = 3;

function SubscriptionCard() {
  const { push, replace } = useFlow();
  const { data } = useSubscriptionsQuery({});

  if (data.length === 0) return <EmptySubscription />;

  /*
   * 결제가 임박한 순서.
   *
   * 전에는 API가 준 순서대로 앞 3개를 잘라 써서 "결제 일정"인데도 날짜와
   * 아무 관계가 없었다. nextBillingDate는 서버가 계산해 주는 "YYYY-MM-DD"라
   * 문자열 비교만으로 날짜순이 된다.
   *
   * 일시정지된 구독은 결제가 나가지 않으므로 뺀다. 남겨두면 오지 않을 결제가
   * D-day를 달고 목록 위쪽을 차지한다.
   */
  const upcoming = [...data]
    .filter((item) => item.status !== "PAUSED")
    .sort((a, b) => a.nextBillingDate.localeCompare(b.nextBillingDate))
    .slice(0, 3);

  return (
    <div>
      <Card className="border-gray-300">
        <div className="flex items-center justify-between">
          <Text type="large" weight="bold">
            구독료 결제 일정
          </Text>
          <IconButton
            label="구독 전체 보기"
            icon={<Icon icon="chevronRight" size="sm" color="tertiary" />}
            variant="ghost"
            size="sm"
            onClick={() => replace("Subscribe", {}, { animate: false })}
          />
        </div>
        {upcoming.length === 0 && (
          <Text type="body" color="secondary" className="mt-3">
            예정된 결제가 없어요
          </Text>
        )}
        <List className="mt-3" density="spacious">
          {upcoming.map((item) => {
            return (
              <ListItem
                onClick={() => push("SubscribeDetail", { id: String(item.id) })}
                startContent={
                  <ServiceLogo
                    name={item.serviceName}
                    fallbackName={item.serviceName}
                  />
                }
                className="p-0 py-1"
                key={item.id}
                label={
                  <Text type="body" weight="semibold">
                    {item.serviceName}
                  </Text>
                }
                description={
                  <Text type="supporting" weight="semibold">
                    {formatWon(item.price)}
                  </Text>
                }
                endContent={(() => {
                  const daysLeft = daysSince(item.nextBillingDate);
                  return (
                    <Badge
                      // 코앞으로 다가온 결제는 색을 바꿔 눈에 걸리게 한다.
                      // 원치 않는 자동 결제를 막으려면 이 며칠이 중요하다.
                      variant={daysLeft <= IMMINENT_DAYS ? "red" : "blue"}
                      // 오늘 빠져나가는 건 "D-0"보다 "D-day"가 바로 읽힌다.
                      label={daysLeft === 0 ? "D-day" : `D-${daysLeft}`}
                    />
                  );
                })()}
              />
            );
          })}
        </List>
      </Card>
    </div>
  );
}

export default SubscriptionCard;
