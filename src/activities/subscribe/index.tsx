import { Skeleton, Tab, TabList } from "@astryxdesign/core";
import { VStack } from "@astryxdesign/core/VStack";
import { Suspense, useTransition } from "react";
import {
  useStepFlow,
  type StaticActivityComponentType,
} from "@stackflow/react";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import TabLayout from "../layout";
import ScheduleView from "./schedule-view";
import ListView from "./list-view";

const SubscribeActivity: StaticActivityComponentType<"Subscribe"> = ({
  params,
}) => {
  // 탭을 스텝 파라미터로 들고 있어서 새로고침해도 보던 탭이 유지된다.
  // pushStep이 아니라 replaceStep이라 뒤로 가기가 탭 이력을 되짚지 않는다.
  const { replaceStep } = useStepFlow("Subscribe");
  const [isPending, startTransition] = useTransition();

  const tab = params.tab ?? "일정";

  const changeTab = (next: string) =>
    startTransition(() => replaceStep({ tab: next as typeof tab }));

  return (
    // 탭 루트라 되돌아갈 곳이 없다. 스와이프백을 막아둔다.
    <AppScreen preventSwipeBack>
      <TabLayout>
        <VStack padding={4} gap={3}>
          <TabList
            className="flex justify-around"
            value={tab}
            onChange={changeTab}
          >
            <Tab className="text-lg w-1/2" value="일정" label="일정" />
            <Tab className="text-lg w-1/2" value="목록" label="목록" />
          </TabList>

          <VStack className={isPending ? "opacity-60 transition-opacity" : ""}>
            <Suspense fallback={<Skeleton />}>
              {tab === "일정" ? <ScheduleView /> : <ListView />}
            </Suspense>
          </VStack>
        </VStack>
      </TabLayout>
    </AppScreen>
  );
};

export default SubscribeActivity;
