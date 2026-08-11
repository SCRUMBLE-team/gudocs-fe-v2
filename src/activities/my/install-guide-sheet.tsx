import { Button } from "@astryxdesign/core/Button";
import { List, ListItem } from "@astryxdesign/core/List";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import BottomSheet from "../../components/bottom-sheet";

/**
 * iOS Safari 전용 설치 안내.
 *
 * iOS에는 beforeinstallprompt가 없어서 홈 화면 추가를 코드로 띄울 방법이 없다.
 * 사용자가 직접 밟아야 하는 단계를 그대로 보여준다.
 */
function InstallGuideSheet({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="홈 화면에 추가하기"
    >
      <VStack paddingInline={4} paddingBlock={2} gap={3}>
        <List listStyle="decimal" density="compact">
          <ListItem label="브라우저 하단의 공유 버튼을 눌러주세요" />
          <ListItem label="'홈 화면에 추가'를 선택해주세요" />
          <ListItem label="오른쪽 위 '추가'를 눌러주세요" />
        </List>
        <Text type="supporting" color="secondary">
          홈 화면에 추가하면 앱처럼 바로 열 수 있고, 결제일 알림도 받을 수 있어요.
        </Text>
        <Button label="확인" size="lg" onClick={() => onOpenChange(false)} />
      </VStack>
    </BottomSheet>
  );
}

export default InstallGuideSheet;
