import { VStack } from "@astryxdesign/core/VStack";
import { Button } from "@astryxdesign/core/Button";

/**
 * TDS의 FixedBottomCTA. 화면 하단에 붙는 전체 폭 주요 버튼이다.
 *
 * 스크롤 컨테이너 안에서 sticky로 붙이고, 위쪽에 배경색 그라디언트 대신
 * 표면색을 깔아 콘텐츠가 버튼 뒤로 비쳐 보이지 않게 한다.
 */
export type FixedBottomCTAProps = {
  label: string;
  onClick: () => void;
  isDisabled?: boolean;
};

function FixedBottomCTA({ label, onClick, isDisabled }: FixedBottomCTAProps) {
  return (
    <VStack
      className="sticky bottom-0 mt-auto bg-surface"
      paddingInline={4}
      paddingBlock={3}
    >
      <Button
        label={label}
        variant="primary"
        size="lg"
        onClick={onClick}
        isDisabled={isDisabled}
      />
    </VStack>
  );
}

export default FixedBottomCTA;
