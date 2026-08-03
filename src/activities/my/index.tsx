import type { StaticActivityComponentType } from "@stackflow/react";
import { useFlow } from "@stackflow/react";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { Divider, Item, List, VStack } from "@astryxdesign/core";
import { useToast } from "@astryxdesign/core/Toast";
import TabLayout from "../layout";
import { useLogoutMutation } from "../../hooks/query/useLogoutMutation";
import { useUserQuery } from "../../hooks/query/useUserQuery";
import { usePushNotification } from "../../hooks/usePushNotification";

const MyActivity: StaticActivityComponentType<"My"> = () => {
  const { data: user } = useUserQuery();
  const { replace } = useFlow();
  const showToast = useToast();
  const logoutMutation = useLogoutMutation();
  const { disable } = usePushNotification();

  async function handleLogout() {
    // 푸시 해제가 먼저다. DELETE /api/push-registrations는 세션 쿠키로
    // 인증하는데, 로그아웃이 먼저 나가면 401이 떨어져 등록이 서버에 남는다.
    // disable()은 실패해도 false만 돌려주므로 로그아웃 흐름을 막지 않는다.
    await disable();

    try {
      await logoutMutation.mutateAsync();
      replace("Landing", {}, { animate: false });
    } catch {
      showToast({
        body: "로그아웃에 실패했어요. 잠시 후 다시 시도해주세요.",
        type: "error",
        isAutoHide: true,
        autoHideDuration: 3000,
      });
    }
  }

  return (
    <AppScreen preventSwipeBack>
      <TabLayout>
        <VStack gap={2}>
          <Item
            density="spacious"
            label={user?.name ?? ""}
            description={user?.email}
          />
          <Divider />
          <List>
            <Item
              as="li"
              density="spacious"
              label="로그아웃"
              onClick={handleLogout}
            />
          </List>
        </VStack>
      </TabLayout>
    </AppScreen>
  );
};

export default MyActivity;
