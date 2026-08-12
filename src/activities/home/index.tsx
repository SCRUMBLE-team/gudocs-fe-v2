import { Suspense } from "react";
import type { StaticActivityComponentType } from "@stackflow/react";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import TabLayout from "../layout";
import SpendingSummary from "./spending-summary";
import SubscriptionCard from "./subscription-card";
import AnalyzeExpenses from "./analyze-expenses";
import SavingsInvite from "./savings-invite";
import PriceChangeBanner from "./price-change-banner";

const HomeActivity: StaticActivityComponentType<"Home"> = () => {
  return (
    // 스택의 맨 아래 화면이라 되돌아갈 곳이 없다. 스와이프백을 막아둔다.
    <AppScreen preventSwipeBack>
      <TabLayout>
        <VStack padding={4} gap={3}>
          {/* 경고성 안내라 첫 화면 맨 위에 둔다. 예고가 없으면 스스로 사라진다. */}
          <Suspense>
            <PriceChangeBanner />
          </Suspense>
          <Suspense>
            <SubscriptionCard />
          </Suspense>
          <Suspense>
            <SpendingSummary />
          </Suspense>
          <Suspense>
            <AnalyzeExpenses />
          </Suspense>
          <Suspense>
            <SavingsInvite />
          </Suspense>
        </VStack>
      </TabLayout>
    </AppScreen>
  );
};

export default HomeActivity;
