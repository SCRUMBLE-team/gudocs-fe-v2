import { useFlow, type StaticActivityComponentType } from "@stackflow/react";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import { Button } from "@astryxdesign/core/Button";
import { Text } from "@astryxdesign/core/Text";
import netflixLogo from "../../assets/logo/service/NETFLIX.png";
import youtubePremiumLogo from "../../assets/logo/service/YOUTUBE_PREMIUM.png";
import chatGptLogo from "../../assets/logo/service/CHATGPT.png";

const MONTHLY_BARS = [34, 52, 44, 72, 58, 86];

/** 랜딩의 앱 미리보기. 실제 데이터가 아니라 제품이 주는 효용만 간단히 보여준다. */
function SubscriptionPreview() {
  return (
    <div
      className="relative mx-auto mt-7 h-[278px] w-full max-w-[350px]"
      aria-hidden="true"
    >
      <div className="absolute inset-x-5 bottom-0 top-5 rounded-[32px] bg-accent-muted" />

      <div className="absolute left-0 top-3 z-20 grid size-14 place-items-center rounded-2xl border border-border bg-surface shadow-lg">
        <img src={netflixLogo} alt="" className="size-10 rounded-xl object-cover" />
      </div>
      <div className="absolute right-0 top-16 z-20 grid size-14 place-items-center rounded-2xl border border-border bg-surface shadow-lg">
        <img
          src={youtubePremiumLogo}
          alt=""
          className="size-10 rounded-xl object-cover"
        />
      </div>
      <div className="absolute bottom-5 left-3 z-20 grid size-12 place-items-center rounded-2xl border border-border bg-surface shadow-lg">
        <img src={chatGptLogo} alt="" className="size-9 rounded-xl object-cover" />
      </div>

      <div className="absolute inset-x-10 top-10 z-10 rounded-[28px] border border-border bg-surface p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-secondary">
            이번 달 구독료
          </span>
          <span className="rounded-full bg-accent-muted px-2.5 py-1 text-xs font-semibold text-accent">
            6개 구독 중
          </span>
        </div>
        <p className="mt-2 text-[28px] font-bold tracking-[-0.03em] text-primary tabular-nums">
          42,900원
        </p>

        <div className="mt-5 flex h-20 items-end justify-between gap-2 border-b border-border px-1">
          {MONTHLY_BARS.map((height, index) => (
            <div
              key={height}
              className={`w-full rounded-t-md ${
                index === MONTHLY_BARS.length - 1
                  ? "bg-accent"
                  : "bg-accent-muted"
              }`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl bg-[var(--color-background-muted)] px-3 py-2.5">
          <span className="text-xs font-medium text-secondary">
            다음 결제일
          </span>
          <span className="text-sm font-bold text-accent">D-3 · 넷플릭스</span>
        </div>
      </div>
    </div>
  );
}

const LandingActivity: StaticActivityComponentType<"Landing"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <div className="relative flex min-h-full flex-col overflow-hidden bg-surface px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-[max(24px,env(safe-area-inset-top))]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_50%_0%,var(--color-accent-muted),transparent_68%)]" />

        <header className="relative z-10 flex items-center gap-2" aria-label="Gudocs">
          <div className="grid size-8 place-items-center rounded-xl bg-accent text-sm font-extrabold text-on-accent shadow-sm">
            G
          </div>
          <Text type="large" weight="bold" color="accent">
            Gudocs
          </Text>
        </header>

        <main className="relative z-10 flex flex-1 flex-col justify-center py-6">
          <VStack align="center" gap={3}>
            <Text
              as="h1"
              type="display-3"
              weight="bold"
              justify="center"
              className="whitespace-pre-line text-[30px] leading-[1.25] tracking-[-0.035em]"
            >
              {"구독 관리의 시작,\n"}
              <span className="text-accent">구Docs</span>
            </Text>
            <Text
              as="p"
              type="body"
              color="secondary"
              justify="center"
              className="whitespace-pre-line leading-6"
            >
              {"결제일 알림부터 월별 지출까지\n구Docs에서 한 번에 관리하세요"}
            </Text>
          </VStack>

          <SubscriptionPreview />
        </main>

        <VStack className="relative z-10" gap={2}>
          <Button
            label="구Docs 시작하기"
            variant="primary"
            size="lg"
            onClick={() => push("Login", {})}
          />
          <Text type="supporting" color="secondary" justify="center">
            간편 로그인으로 바로 시작할 수 있어요
          </Text>
        </VStack>
      </div>
    </AppScreen>
  );
};

export default LandingActivity;
