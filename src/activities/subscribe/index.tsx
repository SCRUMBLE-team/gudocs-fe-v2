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
            {/*
              Tab은 높이가 size 토큰으로 고정돼 있어(--size-element-*, 최대 lg가
              36px) 패딩을 줘도 박스가 커지지 않는다. 탭이 w-1/2라 좌우는 넓은데
              위아래만 납작해 보이므로 높이를 직접 잡는다.
              (Tailwind utilities 레이어가 맨 뒤라 stylex의 height를 덮는다.)
            */}
            <Tab className="text-lg w-1/2 h-12" value="일정" label="일정" />
            <Tab className="text-lg w-1/2 h-12" value="목록" label="목록" />
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
