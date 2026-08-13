import Lottie from "lottie-react";
import type { StaticActivityComponentType } from "@stackflow/react";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import documentLottie from "../../assets/lottie/document.json";
import kakaoLogo from "../../assets/logo/kakao.png";
import naverLogo from "../../assets/logo/naver.png";
import googleLogo from "../../assets/logo/google.png";

// 소셜 로그인 버튼은 각 사업자의 브랜드 가이드가 색을 고정하므로
// 디자인 시스템 토큰이 아니라 지정된 브랜드 색을 그대로 쓴다.
const SOCIAL_LOGIN_PROVIDERS = [
  {
    name: "kakao",
    label: "카카오로 시작하기",
    logo: kakaoLogo,
    className: "bg-[#FEE500] text-black/85",
  },
  {
    name: "naver",
    label: "네이버로 시작하기",
    logo: naverLogo,
    className: "bg-[#03A94D] text-white",
  },
  {
    name: "google",
    label: "Google로 시작하기",
    logo: googleLogo,
    className: "bg-white text-[#1F1F1F] border border-gray-400",
  },
] as const;

type SocialProvider = (typeof SOCIAL_LOGIN_PROVIDERS)[number]["name"];

const LoginActivity: StaticActivityComponentType<"Login"> = () => {
  function handleSocialLogin(provider: SocialProvider) {
    window.location.assign(`/oauth2/authorization/${provider}`);
  }

  return (
    <AppScreen>
      <VStack
        height="100%"
        justify="center"
        align="center"
        gap={3}
        padding={4}
      >
        <VStack align="center">
          <Lottie
            animationData={documentLottie}
            loop
            style={{ width: 300, height: 300 }}
          />
          <Text
            type="display-3"
            weight="bold"
            justify="center"
            // break-keep이 없으면 한 줄이 폭을 넘길 때 "시작하세 / 요"처럼
            // 어절 중간에서 끊긴다. 한글 기본 줄바꿈이 글자 단위라서다.
            //
            // display-3의 기본 크기(gudocs 테마에서 40px)로는 첫 줄이 좁은
            // 기기에서 넘쳐 "모아"만 홀로 다음 줄로 떨어진다. 360px 폭에서도
            // 두 줄로 앉도록 한 단계 낮춘다.
            //
            // size prop은 안 먹는다. 생성된 테마의 .astryx-text.display-3이
            // astryx-theme 레이어에서 font-size를 다시 잡는데, size가 만드는
            // stylex 클래스는 그보다 앞선 레이어라 진다. utilities 레이어가
            // 맨 뒤라 여기서 토큰으로 지정한다.
            className="whitespace-pre-line break-keep text-[length:var(--font-size-2xl)]"
          >
            {"구독 관리, 한 번에\ngudocs로 시작하세요"}
          </Text>
        </VStack>

        <VStack gap={3} width="100%" className="mt-8">
          {SOCIAL_LOGIN_PROVIDERS.map(({ name, label, logo, className }) => (
            <HStack
              as="button"
              key={name}
              onClick={() => handleSocialLogin(name)}
              gap={3}
              justify="center"
              align="center"
              height={52}
              className={`rounded-xl font-medium ${className}`}
            >
              <img src={logo} alt="" className="object-contain" />
              <span>{label}</span>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </AppScreen>
  );
};

export default LoginActivity;
