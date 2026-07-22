import { Suspense } from "react";
import { VStack } from "@astryxdesign/core/VStack";
import SpendingSummary from "./spending-summary";
import SubscriptionCard from "./subscription-card";
import AnalyzeExpenses from "./analyze-expenses";

function HomePage() {
  return (
    <>
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
    </>
  );
}

export default HomePage;
