import { useFlow, type StaticActivityComponentType } from "@stackflow/react";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import { Button } from "@astryxdesign/core/Button";

const LandingActivity: StaticActivityComponentType<"Landing"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <VStack height="100%" justify="end" padding={4}>
        <Button
          label="시작하기"
          variant="primary"
          size="lg"
          onClick={() => push("Login", {})}
        />
      </VStack>
    </AppScreen>
  );
};

export default LandingActivity;
