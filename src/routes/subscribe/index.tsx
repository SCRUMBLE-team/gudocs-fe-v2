import { Tab, TabList } from "@astryxdesign/core";
import { VStack } from "@astryxdesign/core/VStack";
import { Suspense, useState } from "react";
import ScheduleView from "./schedule-view";
import ListView from "./list-view";

function SubscribePage() {
  const [tab, setTab] = useState("일정");

  return (
    <VStack padding={4} gap={3}>
      <TabList className="flex justify-around" value={tab} onChange={setTab}>
        <Tab className="text-lg w-1/2" value="일정" label="일정" />
        <Tab className="text-lg w-1/2" value="목록" label="목록" />
      </TabList>

      {tab === "일정" && (
        <Suspense>
          <ScheduleView />
        </Suspense>
      )}

      {tab === "목록" && (
        <Suspense>
          <ListView />
        </Suspense>
      )}
    </VStack>
  );
}

export default SubscribePage;
