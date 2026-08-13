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
 * 브라우저가 매 프레임 스냅을 되돌려서 손가락을 따라오지 않는다. 손을 떼면
 * 가장 가까운 슬라이드로 옮겨 애매한 위치에 멈추지 않게 한다.
 *
 * 코드로 자리를 옮기는 동안에도 스냅은 꺼둔다(scrollToIndex 주석 참고).
 * 사람이 직접 스와이프·트랙패드로 넘기는 평소에는 CSS 스냅만으로 돌아간다.
 */
function FeatureCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // 커서 모양과 텍스트 선택 차단에만 쓴다. 드래그 진행 여부의 판단 기준은
  // 아래 dragState다 — state는 커밋이 늦어 손을 뗄 때 아직 false일 수 있다.
  const [isDragging, setIsDragging] = useState(false);

  /**
   * 진행 중인 드래그. 리렌더가 필요 없어 ref에 둔다.
   *
   * hasMoved까지 여기에 두는 게 중요하다. pointermove는 리액트가 연속 이벤트로
   * 묶어 처리해서 setIsDragging(true)이 커밋되기 전에 pointerup이 먼저 올 수
   * 있다. 그때 state를 보고 판단하면 손을 뗐는데도 스냅이 꺼진 채로 남아
   * 슬라이드가 어중간한 위치에 멈춘다.
   */
  const dragState = useRef<{
    startX: number;
    startScrollLeft: number;
    hasMoved: boolean;
  } | null>(null);

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

  /** 스냅을 다시 켤 타이머. 옮기는 도중에 또 옮기면 앞의 예약은 버린다. */
  const restoreTimer = useRef<number | null>(null);
  /** 예약해둔 스크롤 프레임. 같은 이유로 하나만 살려둔다. */
  const pendingFrame = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (restoreTimer.current !== null) clearTimeout(restoreTimer.current);
      if (pendingFrame.current !== null)
        cancelAnimationFrame(pendingFrame.current);
    },
    [],
  );

  /**
   * 슬라이드 하나만큼 자리를 옮긴다. dot을 눌렀을 때와 드래그를 놓았을 때 공통.
   *
   * 옮기는 동안에는 스냅을 끈다. 스냅이 켜진 채로 애니메이션하면 크롬이 도착한
   * 뒤 출발했던 슬라이드로 도로 끌어당긴다(420까지 갔다가 0으로 돌아왔다).
   * 도착할 때쯤 다시 켜면 이후 스와이프는 평소대로 스냅된다.
   */
  function scrollToIndex(index: number) {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    setSnapEnabled(scroller, false);

    // 한 프레임 미룬다. 드래그로 방금 scrollLeft를 대입한 프레임에서 바로
    // 부르면 크롬이 부드러운 스크롤을 통째로 무시해서(250에서 그대로 멈췄다)
    // 손을 뗀 자리에 어중간하게 남는다.
    if (pendingFrame.current !== null) cancelAnimationFrame(pendingFrame.current);
    pendingFrame.current = requestAnimationFrame(() => {
      pendingFrame.current = null;
      scroller.scrollTo({
        left: index * scroller.clientWidth,
        behavior: "smooth",
      });
    });

    if (restoreTimer.current !== null) clearTimeout(restoreTimer.current);
    // scrollend는 iOS Safari 지원이 늦어 타이머로 되돌린다. 스크롤 애니메이션은
    // 길어야 300ms대라 넉넉히 잡아도 사용자가 다음 동작을 하기 전에 끝난다.
    restoreTimer.current = window.setTimeout(
      () => setSnapEnabled(scroller, true),
      500,
    );
  }

  /**
   * 스냅 on/off.
   *
   * 클래스가 아니라 인라인 스타일로 직접 켜고 끈다. state로 바꾸면 리렌더가
   * 커밋된 다음에야 스타일이 반영돼서, 손을 뗀 직후 자리를 잡는 스크롤이
   * 아직 옛 설정으로 실행된다.
   */
  function setSnapEnabled(scroller: HTMLDivElement, isOn: boolean) {
    scroller.style.scrollSnapType = isOn ? "" : "none";
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    // 터치는 브라우저의 관성 스크롤이 훨씬 자연스러워서 손대지 않는다.
    if (event.pointerType !== "mouse") return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // 막지 않으면 끄는 동안 카피가 텍스트로 잡혀 파랗게 드래그된다.
    event.preventDefault();
    dragState.current = {
      startX: event.clientX,
      startScrollLeft: scroller.scrollLeft,
      hasMoved: false,
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    const drag = dragState.current;
    if (!scroller || !drag) return;

    const distance = event.clientX - drag.startX;
    // 살짝 눌린 정도로 스냅을 끄면 그냥 클릭한 경우까지 드래그로 잡힌다.
    if (!drag.hasMoved && Math.abs(distance) < DRAG_THRESHOLD) return;

    if (!drag.hasMoved) {
      drag.hasMoved = true;
      setIsDragging(true);
      // 예약된 복구·스크롤이 남아 있으면 드래그 도중에 끼어들어 손을 따라오지 못한다.
      if (restoreTimer.current !== null) clearTimeout(restoreTimer.current);
      if (pendingFrame.current !== null) {
        cancelAnimationFrame(pendingFrame.current);
        pendingFrame.current = null;
      }
      setSnapEnabled(scroller, false);
      // 커서가 캐러셀 밖으로 나가도 계속 따라오게 한다.
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    scroller.scrollLeft = drag.startScrollLeft - distance;
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    const drag = dragState.current;
    if (!scroller || !drag) return;

    dragState.current = null;
    // 끌지 않고 눌렀다 뗀 것뿐이면 스냅을 건드린 적도 없다.
    if (!drag.hasMoved) return;

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
        className={`flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          isDragging ? "cursor-grabbing select-none" : "cursor-grab"
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
