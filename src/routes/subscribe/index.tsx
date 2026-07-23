import { Skeleton, Tab, TabList } from "@astryxdesign/core";
import { VStack } from "@astryxdesign/core/VStack";
import { Suspense, useState, useTransition } from "react";
import ScheduleView from "./schedule-view";
import ListView from "./list-view";

function SubscribePage() {
  const [tab, setTab] = useState("일정");
  const [isPending, startTransition] = useTransition();

  const changeTab = (next: string) => startTransition(() => setTab(next));

  return (
    <VStack padding={4} gap={3}>
      <TabList className="flex justify-around" value={tab} onChange={changeTab}>
        <Tab className="text-lg w-1/2" value="일정" label="일정" />
        <Tab className="text-lg w-1/2" value="목록" label="목록" />
      </TabList>

      <VStack className={isPending ? "opacity-60 transition-opacity" : ""}>
        <Suspense fallback={<Skeleton />}>
          {tab === "일정" ? <ScheduleView /> : <ListView />}
        </Suspense>
      </VStack>
    </VStack>
  );
}

export default SubscribePage;
