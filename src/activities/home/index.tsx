import { Suspense } from "react";
import type { StaticActivityComponentType } from "@stackflow/react";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import TabLayout from "../layout";
import SpendingSummary from "./spending-summary";
import SubscriptionCard from "./subscription-card";
import AnalyzeExpenses from "./analyze-expenses";

const HomeActivity: StaticActivityComponentType<"Home"> = () => {
  return (
    // 스택의 맨 아래 화면이라 되돌아갈 곳이 없다. 스와이프백을 막아둔다.
    <AppScreen preventSwipeBack>
      <TabLayout>
        <VStack padding={4} gap={3}>
          <Suspense>
            <SubscriptionCard />
          </Suspense>
          <Suspense>
            <SpendingSummary />
          </Suspense>
          <Suspense>
            <AnalyzeExpenses />
          </Suspense>
        </VStack>
      </TabLayout>
    </AppScreen>
  );
};

export default HomeActivity;
