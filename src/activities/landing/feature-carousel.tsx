import { useEffect, useRef, useState } from "react";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { AlertVisual, OverviewVisual, SavingsVisual } from "./slide-visuals";

type Slide = {
  id: string;
  headline: string;
  /** 두 줄 고정. 줄바꿈 위치까지 카피의 일부다. */
  description: string;
  Visual: () => React.ReactElement;
};

const SLIDES: Slide[] = [
  {
    id: "overview",
    headline: "흩어진 구독을 한눈에",
    description:
      "이번 달 구독료부터 다가오는 결제일까지\ngudocs에서 한 번에 확인하세요",
    Visual: OverviewVisual,
  },
  {
    id: "savings",
    headline: "이번 달, 얼마나 아꼈을까요?",
    description: "월별 구독 지출을 비교하고\n달라진 금액을 한눈에 확인하세요",
    Visual: SavingsVisual,
  },
  {
    id: "alert",
    headline: "구독료 변화도 놓치지 않게",
    description: "가격 변경부터 다가오는 결제일까지\n필요한 순간에 미리 알려드려요",
    Visual: AlertVisual,
  },
];

/** 이 거리(px) 안에서 놓으면 클릭으로 보고 드래그로 치지 않는다. */
const DRAG_THRESHOLD = 4;

/**
 * 기능 소개 캐러셀.
 *
 * 넘기는 방식은 CSS scroll-snap 하나로 통일한다. 모바일 스와이프와 트랙패드
 * 가로 스크롤은 브라우저가 알아서 처리하고, 마우스 드래그만 포인터 이벤트로 얹는다.
 * autoplay는 쓰지 않는다 — 읽는 도중에 화면이 넘어가면 오히려 놓친다.
 *
 * 드래그 중에는 scroll-snap을 잠깐 끈다. 켜둔 채로 scrollLeft를 직접 만지면
 * 브라우저가 매 프레임 스냅을 되돌려서 손가락을 따라오지 않는다. 손을 떼는
 * 순간 가장 가까운 슬라이드로 직접 스크롤해 애매한 위치에 멈추지 않게 한다.
 */
function FeatureCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // 드래그 중에만 쓰는 값이라 리렌더가 필요 없다.
  const dragState = useRef<{ startX: number; startScrollLeft: number } | null>(
    null,
  );

  /** 스크롤 위치에서 현재 슬라이드를 되읽는다. 스와이프·드래그·트랙패드 공통. */
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      const width = scroller.clientWidth;
      if (width === 0) return;
      const index = Math.round(scroller.scrollLeft / width);
      setActiveIndex(Math.min(Math.max(index, 0), SLIDES.length - 1));
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToIndex(index: number) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({ left: index * scroller.clientWidth, behavior: "smooth" });
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    // 터치는 브라우저의 관성 스크롤이 훨씬 자연스러워서 손대지 않는다.
    if (event.pointerType !== "mouse") return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    dragState.current = {
      startX: event.clientX,
      startScrollLeft: scroller.scrollLeft,
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    const drag = dragState.current;
    if (!scroller || !drag) return;

    const distance = event.clientX - drag.startX;
    // 살짝 눌린 정도로 스냅을 끄면 그냥 클릭한 경우까지 드래그로 잡힌다.
    if (!isDragging && Math.abs(distance) < DRAG_THRESHOLD) return;

    if (!isDragging) {
      setIsDragging(true);
      // 커서가 캐러셀 밖으로 나가도 계속 따라오게 한다.
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    scroller.scrollLeft = drag.startScrollLeft - distance;
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    if (!scroller || !dragState.current) return;

    dragState.current = null;
    if (!isDragging) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
    scrollToIndex(Math.round(scroller.scrollLeft / scroller.clientWidth));
  }

  return (
    <VStack gap={4}>
      <div
        ref={scrollerRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="gudocs 기능 소개"
        className={`flex w-full overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          isDragging
            ? "cursor-grabbing snap-none select-none"
            : "cursor-grab snap-x snap-mandatory"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {SLIDES.map(({ id, headline, description, Visual }, index) => (
          <div
            key={id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${SLIDES.length} · ${headline}`}
            className="w-full shrink-0 snap-center px-1"
          >
            <VStack align="center" gap={3}>
              <Text
                as="h2"
                type="display-3"
                weight="bold"
                justify="center"
                className="text-[30px] leading-[1.25] tracking-[-0.035em]"
              >
                {headline}
              </Text>
              <Text
                as="p"
                type="body"
                color="secondary"
                justify="center"
                className="whitespace-pre-line leading-6"
              >
                {description}
              </Text>
            </VStack>
            <Visual />
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        {SLIDES.map(({ id, headline }, index) => (
          <button
            key={id}
            type="button"
            aria-label={headline}
            aria-current={index === activeIndex}
            onClick={() => scrollToIndex(index)}
            className={`size-2 rounded-full transition-colors ${
              index === activeIndex ? "bg-accent" : "bg-accent-muted"
            }`}
          />
        ))}
      </div>
    </VStack>
  );
}

export default FeatureCarousel;
