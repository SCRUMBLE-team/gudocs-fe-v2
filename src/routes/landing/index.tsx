import { BottomCTA, Top } from "@toss/tds-mobile";

function LandingPage() {
  return (
    <div>
      <Top
        subtitleTop={
          <Top.SubtitleBadges
            badges={[
              {
                text: `✦ 구독관리의 새로운 기준`,
                color: `blue`,
                variant: `weak`,
              },
            ]}
          />
        }
        title={
          <Top.TitleParagraph size={28}>
            꼼꼼한 구독관리가 필요할 땐
          </Top.TitleParagraph>
        }
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            넷플릭스, 유튜브, ChatGPT까지— 모든 구독을 한 눈에. 지출을
            스마트하게.
          </Top.SubtitleParagraph>
        }
      />
      <>
        {/**서비스 소개 페이지 컴포넌트
         * 서비스에 대한 내용이 추가 되야 하는 페이지임
         * 너무 많은 텍스트를 담기보다는 간략한 텍스트 및 소개로 구성되면 좋을거 같음
         * 그리고 모바일 느낌으로 스크를 해서 다음 소개로 넘길 수 있도록 하는거
         *
         */}
      </>
      <BottomCTA>시작하기</BottomCTA>
    </div>
  );
}

export default LandingPage;
