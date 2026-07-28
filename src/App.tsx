import { VStack } from "@astryxdesign/core/VStack";
import { Stack } from "./stackflow";

function App() {
  return (
    // relative는 지우면 안 된다. AppScreen이 position: absolute + inset 0으로 깔려서
    // 이 엘리먼트가 containing block 노릇을 해야 스택이 480px 프레임 안에 갇힌다.
    <VStack
      id="app-root"
      height="100dvh"
      maxWidth={480}
      className="relative mx-auto overflow-hidden bg-surface shadow-lg"
    >
      <Stack />
    </VStack>
  );
}

export default App;
