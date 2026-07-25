import { useState } from "react";
import { VStack } from "@astryxdesign/core/VStack";
import { generateRandomName } from "../../utils/random-name";
import SetName from "./funnel/set-name";

/**
 * 소셜 로그인 직후 이름이 없는 신규 유저가 거치는 온보딩 퍼널.
 * 지금은 이름 설정 한 스텝뿐이라 스텝 상태 없이 화면만 분리해 두고,
 * 스텝이 둘 이상이 되면 subscribe/new처럼 step union + context를 도입한다.
 */
function OnboardingPage() {
  // 진입하자마자 제안 이름이 채워져 있어야 하므로 lazy initializer로 한 번만 뽑는다.
  const [name, setName] = useState(() => generateRandomName());

  return (
    // 로그인 제공자 페이지에서 막 넘어온 화면이라 뒤로가기를 두지 않는다.
    // 뒤로 가면 앱이 아니라 인증 페이지로 되돌아간다.
    <VStack className="flex-1" isScrollable>
      <SetName name={name} onChangeName={setName} />
    </VStack>
  );
}

export default OnboardingPage;
