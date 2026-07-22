import {
  Avatar,
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
import { getServiceLogo } from "../../constants/category";
import { formatWon } from "../../utils/format";
import { daysSince } from "../../utils/date";
import { useNavigate } from "react-router-dom";

function SubscriptionCard() {
  const navigate = useNavigate();
  const { data } = useSubscriptionsQuery({});

  const subscribeList = [...data].splice(0, 3);

  if (!data) return <EmptySubscription />;

  return (
    <div>
      <Card className="border-gray-300">
        <div className="flex items-center justify-between">
          <Text type="large" weight="bold">
            최근에 등록하신 서비스에요
          </Text>
          <IconButton
            label="구독 전체 보기"
            icon={<Icon icon="chevronRight" size="sm" color="tertiary" />}
            variant="ghost"
            size="sm"
            onClick={() => navigate("/subscribe")}
          />
        </div>
        <List className="mt-3" density="spacious">
          {subscribeList.map((item) => {
            const serviceLogo =
              getServiceLogo(item.serviceName) ?? getServiceLogo(item.service);
            return (
              <ListItem
                onClick={() => navigate(`/subscribe/${item.id}`)}
                startContent={
                  serviceLogo ? (
                    <img
                      src={serviceLogo}
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-lg object-contain"
                    />
                  ) : (
                    <Avatar name={item.serviceName} size="small" />
                  )
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
                    label={`D-${daysSince(item.createdAt)}`}
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
