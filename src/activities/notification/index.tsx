import type { StaticActivityComponentType } from "@stackflow/react";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { List, ListItem } from "@astryxdesign/core/List";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { useToast } from "@astryxdesign/core/Toast";
import FixedBottomCTA from "../../components/fixed-bottom-cta";
import { useGoBack } from "../../hooks/useGoBack";
import { usePushNotification } from "../../hooks/usePushNotification";
import type { PushPermission } from "../../lib/push";
import NotificationLottie from "../../assets/lottie/notification.json";
import Lottie from "lottie-react";

/** 어떤 알림이 오는지. 켜기 전에 알아야 결정할 수 있다. */
const ALERT_TYPES = [
  { label: "결제 3일 전", description: "미리 정리할 시간을 드려요" },
  { label: "결제 당일", description: "오늘 빠져나가는 금액을 알려드려요" },
  { label: "가격 변동", description: "구독료가 오르면 바로 알려드려요" },
] as const;

/**
 * 권한 상태별 문구.
 *
 * denied/unsupported는 버튼을 눌러도 할 수 있는 게 없다. 비활성 버튼만 두면
 * 막힌 화면이 되므로 이유를 notice에 반드시 적는다.
 */
const COPY: Record<
  PushPermission,
  {
    headline: string;
    cta: string;
    notice?: string;
    /** 사용자가 손쓸 수 없는 상태라 경고 톤으로 띄운다. */
    isNoticeCritical?: boolean;
  }
> = {
  default: {
    headline: "결제 3일 전에 귀띔해 드릴게요",
    cta: "꼭 필요한 알림 받기",
  },
  granted: {
    headline: "알림을 받고 있어요",
    cta: "알림을 받고 있어요",
    notice: "결제일이 다가오면 미리 알려드릴게요",
  },
  denied: {
    headline: "결제 3일 전에 귀띔해 드릴게요",
    cta: "알림 받기",
    notice: "알림이 차단돼 있어요. 브라우저 설정에서 허용해주세요",
    isNoticeCritical: true,
  },
  unsupported: {
    headline: "결제 3일 전에 귀띔해 드릴게요",
    cta: "알림 받기",
    notice:
      "이 브라우저는 알림을 지원하지 않아요. 홈 화면에 추가하면 받을 수 있어요",
    isNoticeCritical: true,
  },
};

/**
 * 알림 설정 화면.
 *
 * 앱 진입 시 자동으로 권한을 묻던 걸 걷어내고 이 화면 하나로 모았다. 맥락 없이
 * 뜬 프롬프트는 거절당하기 쉽고, 한번 거절되면 코드로는 다시 띄울 방법이 없다.
 * 그래서 어떤 알림이 오는지 먼저 보여주고 사용자가 버튼을 눌렀을 때만 요청한다.
 */
const NotificationActivity: StaticActivityComponentType<
  "Notification"
> = () => {
  const goBack = useGoBack();
  const showToast = useToast();
  const { permission, enable, isPending } = usePushNotification();

  const copy = COPY[permission];
  const canEnable = permission === "default";

  async function handleEnable() {
    // 권한 요청은 반드시 클릭 핸들러 안에서 일어나야 한다. iOS Safari는
    // 사용자 제스처 밖에서 온 requestPermission()을 조용히 무시한다.
    const ok = await enable();
    showToast({
      body: ok ? "알림을 켰어요" : "알림을 켜지 못했어요",
      type: ok ? "info" : "error",
      isAutoHide: true,
      autoHideDuration: 3000,
    });
  }

  return (
    <AppScreen>
      <VStack minHeight="100%">
        <HStack paddingInline={2} paddingBlock={2} align="center">
          <IconButton
            label="뒤로 가기"
            icon={<Icon icon="chevronLeft" />}
            variant="ghost"
            onClick={goBack}
          />
          <Text type="body" weight="bold" className="flex-1 text-center">
            알림
          </Text>
          {/* 좌측 뒤로가기 버튼과 같은 폭(32px)을 차지해 타이틀을 정확히 가운데 둔다. */}
          <VStack className="w-8 shrink-0" />
        </HStack>

        <VStack className="flex-1" paddingInline={4} paddingBlock={4} gap={6}>
          <VStack gap={2} align="center">
            <Heading level={2} justify="center">
              {copy.headline}
            </Heading>
            <Text type="body" color="secondary" justify="center">
              구독료가 나가기 전에 미리 알려드릴게요
            </Text>
          </VStack>

          <VStack align="center">
            <Lottie
              animationData={NotificationLottie}
              loop
              style={{ width: 300, height: 300 }}
            />
          </VStack>

          <List density="compact">
            {ALERT_TYPES.map(({ label, description }) => (
              <ListItem
                key={label}
                label={label}
                description={description}
                startContent={<Icon icon="check" size="sm" color="accent" />}
              />
            ))}
          </List>

          {/* Astryx TextColor에는 error가 없다. 경고 톤은 토큰 기반 유틸리티(text-red)로 낸다. */}
          {copy.notice && (
            <Text
              type="supporting"
              color="secondary"
              justify="center"
              className={`whitespace-pre-line ${copy.isNoticeCritical ? "text-red" : ""}`}
            >
              {copy.notice}
            </Text>
          )}
        </VStack>

        <FixedBottomCTA
          label={copy.cta}
          onClick={() => void handleEnable()}
          isDisabled={!canEnable || isPending}
        />
      </VStack>
    </AppScreen>
  );
};

export default NotificationActivity;
