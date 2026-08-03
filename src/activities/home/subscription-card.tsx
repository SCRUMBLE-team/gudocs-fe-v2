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

function SubscriptionCard() {
  const { push, replace } = useFlow();
  const { data } = useSubscriptionsQuery({});

  const subscribeList = [...data].splice(0, 3);

  if (data.length === 0) return <EmptySubscription />;

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
        <List className="mt-3" density="spacious">
          {subscribeList.map((item) => {
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
                endContent={
                  <Badge
                    variant="blue"
                    label={`D-${daysSince(item.nextBillingDate)}`}
                  />
                }
              />
            );
          })}
        </List>
      </Card>
    </div>
  );
}

export default SubscriptionCard;
