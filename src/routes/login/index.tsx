import Lottie from "lottie-react";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { API_BASE_URL } from "../../api/httpClient";
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

function LoginPage() {
  function handleSocialLogin(provider: SocialProvider) {
    window.location.assign(`${API_BASE_URL}/oauth2/authorization/${provider}`);
  }

  return (
    <VStack
      className="flex-1"
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
          className="whitespace-pre-line"
        >
          {"똑똑한 구독\n똑구로 시작하세요"}
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
  );
}

export default LoginPage;
