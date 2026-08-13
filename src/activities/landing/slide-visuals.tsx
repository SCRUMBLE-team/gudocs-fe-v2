import netflixLogo from "../../assets/logo/service/NETFLIX.png";
import youtubePremiumLogo from "../../assets/logo/service/YOUTUBE_PREMIUM.png";
import chatGptLogo from "../../assets/logo/service/CHATGPT.png";
import { PreviewBars, PreviewCard, type PreviewBar } from "./preview-primitives";

/*
 * 슬라이드 세 장이 같은 숫자를 공유한다. 슬라이드를 넘겼을 때 이번 달 구독료가
 * 42,900원에서 다른 값으로 바뀌면 목업 전체가 한 화면이라는 인상이 깨진다.
 */
const THIS_MONTH = "42,900원";
const LAST_MONTH = "56,400원";
const SAVED = "13,500원";

/** 막대 높이는 위 금액 비율에 맞춘다(42,900 / 56,400 ≈ 0.76). */
const MONTHLY_BARS: PreviewBar[] = [
  { label: "1월", height: 40 },
  { label: "2월", height: 55 },
  { label: "3월", height: 48 },
  { label: "4월", height: 72 },
  { label: "5월", height: 86 },
  { label: "6월", height: 65, isCurrent: true },
];

/** 목업 카드 주변에 떠 있는 서비스 로고. 현재 랜딩의 배치를 그대로 유지한다. */
function FloatingLogos() {
  return (
    <>
      <div className="absolute left-0 top-3 z-20 grid size-14 place-items-center rounded-2xl border border-border bg-surface shadow-lg">
        <img
          src={netflixLogo}
          alt=""
          className="size-10 rounded-xl object-cover"
        />
      </div>
      <div className="absolute right-0 top-16 z-20 grid size-14 place-items-center rounded-2xl border border-border bg-surface shadow-lg">
        <img
          src={youtubePremiumLogo}
          alt=""
          className="size-10 rounded-xl object-cover"
        />
      </div>
      <div className="absolute bottom-5 left-3 z-20 grid size-12 place-items-center rounded-2xl border border-border bg-surface shadow-lg">
        <img
          src={chatGptLogo}
          alt=""
          className="size-9 rounded-xl object-cover"
        />
      </div>
    </>
  );
}

/** 목업 한 장이 놓이는 무대. 세 슬라이드가 같은 높이를 써야 넘길 때 안 흔들린다. */
function PreviewStage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative mx-auto mt-6 h-[300px] w-full max-w-[350px]"
      aria-hidden="true"
    >
      <div className="absolute inset-x-5 bottom-0 top-5 rounded-[32px] bg-accent-muted" />
      {children}
    </div>
  );
}

/** 1. 구독 한눈에 관리 — 총액·구독 개수·지출 그래프·다음 결제일. */
export function OverviewVisual() {
  return (
    <PreviewStage>
      <FloatingLogos />

      <PreviewCard className="absolute inset-x-10 top-8 z-10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-secondary">
            이번 달 구독료
          </span>
          <span className="rounded-full bg-accent-muted px-2.5 py-1 text-xs font-semibold text-accent">
            6개 구독 중
          </span>
        </div>
        <p className="mt-2 text-[28px] font-bold tracking-[-0.03em] text-primary tabular-nums">
          {THIS_MONTH}
        </p>

        <div className="mt-5">
          <PreviewBars bars={MONTHLY_BARS} />
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl bg-[var(--color-background-muted)] px-3 py-2.5">
          <span className="text-xs font-medium text-secondary">다음 결제일</span>
          <span className="text-sm font-bold text-accent">D-3 · 넷플릭스</span>
        </div>
      </PreviewCard>
    </PreviewStage>
  );
}

/**
 * 2. 월별 지출 · 절약 금액.
 *
 * 절약 금액이 가장 먼저 읽혀야 해서 카드 맨 위에 제일 큰 글자로 둔다.
 * 덜 쓴 금액은 accent — 서비스 안의 SpendingComparison·ChangeText와 같은 규칙이다.
 */
export function SavingsVisual() {
  return (
    <PreviewStage>
      <PreviewCard className="absolute inset-x-6 top-6 z-10">
        <span className="text-xs font-semibold text-secondary">지난달보다</span>
        <p className="mt-1 text-[24px] font-bold leading-[1.2] tracking-[-0.03em] text-primary">
          <span className="text-accent tabular-nums">{SAVED}</span>
          <br />덜 쓰고 있어요
        </p>

        <div className="mt-3.5 flex items-center gap-2.5">
          <div className="flex-1 rounded-2xl bg-[var(--color-background-muted)] px-3 py-1.5">
            <span className="text-[11px] font-medium text-secondary">
              지난달
            </span>
            <p className="text-sm font-bold text-secondary tabular-nums">
              {LAST_MONTH}
            </p>
          </div>
          <div className="flex-1 rounded-2xl bg-accent-muted px-3 py-1.5">
            <span className="text-[11px] font-medium text-accent">이번 달</span>
            <p className="text-sm font-bold text-accent tabular-nums">
              {THIS_MONTH}
            </p>
          </div>
        </div>

        {/* 카드 위쪽이 절약 금액으로 꽉 차 있어 차트는 낮게 깐다. */}
        <div className="mt-3.5">
          <PreviewBars bars={MONTHLY_BARS} hasLabels height={56} />
        </div>
      </PreviewCard>
    </PreviewStage>
  );
}

/**
 * 3. 가격 변경 · 결제일 알림.
 *
 * OS 푸시 배너를 흉내 내지 않고, 서비스 안에서 쓰는 카드 그대로 두 장을 겹쳐 둔다.
 * 뒤 카드가 살짝 보여야 "알림이 쌓인다"는 게 한눈에 읽힌다.
 */
export function AlertVisual() {
  return (
    <PreviewStage>
      {/* 가격 변경 알림이 위, 결제 예정 알림이 아래. 살짝 겹쳐 두면 알림이
          쌓인다는 게 한눈에 읽힌다. */}
      <PreviewCard className="absolute inset-x-6 top-16 z-10">
        <div className="flex items-center gap-2">
          <img
            src={netflixLogo}
            alt=""
            className="size-8 rounded-lg object-cover"
          />
          <span className="rounded-full bg-accent-muted px-2 py-0.5 text-[11px] font-semibold text-accent">
            가격 변경 예정
          </span>
        </div>
        <p className="mt-2.5 text-[15px] font-bold leading-snug text-primary">
          Netflix 요금제가 변경될 예정이에요
        </p>
        <p className="mt-1 text-xs font-medium text-secondary tabular-nums">
          13,500원 → <span className="text-primary">17,000원</span> ·{" "}
          <span className="text-accent">7월 1일</span>부터
        </p>
      </PreviewCard>

      <PreviewCard className="absolute inset-x-10 top-[173px] z-20 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-secondary">
            다음 결제까지
          </p>
          <p className="mt-0.5 text-sm font-bold text-primary">
            3일 뒤 Netflix가 결제돼요
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-[var(--color-on-accent)]">
          D-3
        </span>
      </PreviewCard>
    </PreviewStage>
  );
}
