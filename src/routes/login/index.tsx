import { Asset } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import documentLottie from "../../assets/lottie/document.json";
import kakaoLogo from "../../assets/logo/kakao.png";
import naverLogo from "../../assets/logo/naver.png";
import googleLogo from "../../assets/logo/google.png";
import { Paragraph } from "@toss/tds-mobile";

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
    className: "bg-white text-[#1F1F1F] border border-gray-200",
  },
] as const;

function LoginPage() {
  const navigate = useNavigate();

  const handleSocialLogin = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center h-dvh justify-center gap-3">
      <div>
        <Asset.Lottie
          frameShape={{
            height: 300,
            width: 300,
          }}
          scaleType="crop"
          src={documentLottie}
        />
        <Paragraph typography="t2" textAlign="center" fontWeight="bold">
          <Paragraph.Text>{`똑똑한 구독\n똑구로 시작하세요`}</Paragraph.Text>
        </Paragraph>
      </div>
      <div className="flex flex-col gap-3 w-84 mt-8">
        {SOCIAL_LOGIN_PROVIDERS.map(({ name, label, logo, className }) => (
          <button
            style={{ borderRadius: "12px", outline: "none" }}
            key={name}
            type="button"
            onClick={handleSocialLogin}
            className={`flex items-center justify-center gap-3 h-13 font-medium outline-none ${className}`}
          >
            <img src={logo} alt="" className="object-contain" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LoginPage;
