import { useState } from "react";
import type { StaticActivityComponentType } from "@stackflow/react";
import { useFlow } from "@stackflow/react";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { Avatar } from "@astryxdesign/core/Avatar";
import { Card } from "@astryxdesign/core/Card";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { List, ListItem } from "@astryxdesign/core/List";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { useToast } from "@astryxdesign/core/Toast";
import TabLayout from "../layout";
import ExpireAccountSheet from "./expire-account-sheet";
import InstallGuideSheet from "./install-guide-sheet";
import { APP_REVIEW_FORM_URL, OPEN_KAKAO_URL } from "../../constants/links";
import { useExpireUserMutation } from "../../hooks/query/useExpireUserMutation";
import { useLogoutMutation } from "../../hooks/query/useLogoutMutation";
import { useUserQuery } from "../../hooks/query/useUserQuery";
import { useInstallPrompt } from "../../hooks/useInstallPrompt";
import { usePushNotification } from "../../hooks/usePushNotification";

const MyActivity: StaticActivityComponentType<"My"> = () => {
  const { data: user } = useUserQuery();
  const { replace } = useFlow();
  const showToast = useToast();
  const logoutMutation = useLogoutMutation();
  const expireUserMutation = useExpireUserMutation();
  const { disable } = usePushNotification();
  const { canPrompt, install } = useInstallPrompt();
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isExpireOpen, setIsExpireOpen] = useState(false);

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

  async function handleExpireUser() {
    // 로그아웃과 같은 이유로 푸시 해제가 먼저다. 탈퇴가 먼저 나가면 세션이
    // 끊겨 DELETE /api/push-registrations가 401로 실패한다.
    await disable();

    try {
      await expireUserMutation.mutateAsync();
      replace("Landing", {}, { animate: false });
    } catch {
      setIsExpireOpen(false);
      showToast({
        body: "탈퇴에 실패했어요. 잠시 후 다시 시도해주세요.",
        type: "error",
        isAutoHide: true,
        autoHideDuration: 3000,
      });
    }
  }

  function handleInstall() {
    if (canPrompt) {
      void install();
      return;
    }
    setIsGuideOpen(true);
  }

  return (
    <AppScreen preventSwipeBack>
      <TabLayout>
        <VStack padding={4} gap={3}>
          <Card className="border-gray-300">
            <HStack align="center" gap={3}>
              <Avatar alt={user?.name ?? ""} size="medium" />
              <VStack gap={0.5}>
                <Text type="large" weight="bold">
                  {user?.name ?? ""}
                </Text>
                {user?.email ? (
                  <Text type="supporting" color="secondary">
                    {user.email}
                  </Text>
                ) : null}
              </VStack>
            </HStack>
          </Card>

          <List density="spacious" hasDividers>
            {/* 네이티브 프롬프트를 쓸 수 없는 환경에서는 handleInstall이 수동 안내 시트를 연다. */}
            <ListItem
              label="홈 화면에 추가"
              description="앱처럼 바로 열고 결제일 알림도 받아보세요"
              endContent={<Icon icon="chevronRight" size="sm" />}
              onClick={handleInstall}
            />
            <ListItem
              label="문의하기"
              href={OPEN_KAKAO_URL}
              target="_blank"
              endContent={<Icon icon="chevronRight" size="sm" />}
            />
            <ListItem
              label="앱 평가하기"
              href={APP_REVIEW_FORM_URL}
              target="_blank"
              endContent={<Icon icon="externalLink" size="sm" />}
            />
            <ListItem label="로그아웃" onClick={handleLogout} />
            <ListItem
              label="계정탈퇴"
              onClick={() => setIsExpireOpen(true)}
            />
          </List>
        </VStack>
      </TabLayout>
      <InstallGuideSheet isOpen={isGuideOpen} onOpenChange={setIsGuideOpen} />
      <ExpireAccountSheet
        isOpen={isExpireOpen}
        onOpenChange={setIsExpireOpen}
        onConfirm={handleExpireUser}
        isPending={expireUserMutation.isPending}
      />
    </AppScreen>
  );
};

export default MyActivity;
