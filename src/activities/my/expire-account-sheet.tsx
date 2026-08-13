import { Button } from "@astryxdesign/core/Button";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import BottomSheet from "../../components/bottom-sheet";

/**
 * 계정 탈퇴 확인 시트.
 *
 * 탈퇴는 되돌릴 수 없고 구독·지출 기록이 통째로 사라진다. 메뉴를 잘못 눌렀을 때
 * 바로 실행되지 않도록 한 번 더 묻고, 무엇이 사라지는지 먼저 알려준다.
 */
function ExpireAccountSheet({
  isOpen,
  onOpenChange,
  onConfirm,
  isPending,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="정말 탈퇴하시겠어요?"
    >
      <VStack paddingInline={4} paddingBlock={2} gap={3}>
        <Text type="body" color="secondary">
          등록한 구독과 지출 기록이 모두 삭제되고, 다시 되돌릴 수 없어요.
        </Text>
        <Button
          label="네, 탈퇴할게요"
          variant="destructive"
          size="lg"
          onClick={onConfirm}
          isDisabled={isPending}
        />
        <Button label="취소" size="lg" onClick={() => onOpenChange(false)} />
      </VStack>
    </BottomSheet>
  );
}

export default ExpireAccountSheet;
