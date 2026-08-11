import {
  Button,
  Icon,
  IconButton,
  Switch,
  VStack,
  HStack,
  Text,
} from "@astryxdesign/core";
import { useState, type ReactNode, type SVGProps } from "react";
import { useFlow } from "@stackflow/react";
import { useToast } from "@astryxdesign/core/Toast";
import BottomSheet from "../../../components/bottom-sheet";
import ServiceLogo from "../../../components/service-logo";
import { useSubscriptionQuery } from "../../../hooks/query/useSubscriptionQuery";
import { useChangeSubscribeStatusMutation } from "../../../hooks/query/useChangeSubscribeStatusMutation";
import { useDeleteSubscriptionMutation } from "../../../hooks/query/useDeleteSubscriptionMutation";
import { CATEGORY_META } from "../../../constants/category";
import { BILLING_CYCLE_META } from "../../../constants/paymet";
import { formatWon } from "../../../utils/format";
import { billingText } from "../../../utils/subscribe";

// Astryx 시맨틱 아이콘에 pencil이 없어 커스텀 SVG로 그린다. (fab의 PlusIcon과 동일 패턴)
function PencilIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      {...props}
    >
      <path
        d="M16.5 4.5l3 3M4 20l1-4L16.5 4.5l3 3L8 19l-4 1z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR");
}

/** 라벨-값 한 줄. onClick이 있으면 우측에 chevron이 붙고 버튼으로 렌더된다. */
function InfoRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value: ReactNode;
  onClick?: () => void;
}) {
  const inner = (
    <HStack
      justify="between"
      align="center"
      paddingBlock={3}
      className="w-full"
    >
      <Text type="body" color="secondary">
        {label}
      </Text>
      <HStack gap={1} align="center">
        {typeof value === "string" ? (
          <Text type="body" weight="medium">
            {value}
          </Text>
        ) : (
          value
        )}
        {onClick && <Icon icon="chevronRight" size="sm" color="tertiary" />}
      </HStack>
    </HStack>
  );

  if (onClick) {
    return (
      <HStack as="button" onClick={onClick} className="w-full text-left">
        {inner}
      </HStack>
    );
  }
  return inner;
}

function SubscriptionDetailContent({ id }: { id: string }) {
  const { push, pop } = useFlow();
  const showToast = useToast();
  const { data } = useSubscriptionQuery(id);
  const changeStatus = useChangeSubscribeStatusMutation();
  const remove = useDeleteSubscriptionMutation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isPaused = data.status === "PAUSED";
  const meta = CATEGORY_META[data.category];
  const goEdit = () => push("SubscribeEdit", { id });

  async function handleToggleActive(isActive: boolean) {
    const nextStatus = isActive ? "ACTIVE" : "PAUSED";
    try {
      await changeStatus.mutateAsync({
        subscriptionId: id,
        status: nextStatus,
      });
      showToast({
        body: isActive ? "구독을 다시 시작했어요" : "구독을 일시정지했어요",
      });
    } catch (error) {
      showToast({
        body: "상태 변경에 실패했어요. 잠시 후 다시 시도해주세요.",
        type: "error",
        isAutoHide: true,
        autoHideDuration: 3000,
      });
      throw error;
    }
  }

  function handleDelete() {
    remove.mutate(id, {
      onSuccess: () => {
        showToast({ body: "구독을 삭제했어요" });
        pop();
      },
      onError: () =>
        showToast({
          body: "삭제에 실패했어요. 잠시 후 다시 시도해주세요.",
          type: "error",
          isAutoHide: true,
          autoHideDuration: 3000,
        }),
    });
  }

  return (
    <VStack className="flex-1">
      <VStack paddingInline={5} paddingBlock={4} gap={2}>
        <HStack gap={2} align="center">
          <ServiceLogo
            name={data.serviceName}
            code={data.serviceCode}
            size={28}
          />
          <Text type="body" weight="semibold" color="secondary">
            {data.serviceName}
          </Text>
        </HStack>

        <HStack gap={1} align="center">
          <Text type="display-3" weight="bold">
            {formatWon(data.price)}
          </Text>
          <IconButton
            label="수정"
            icon={<Icon icon={PencilIcon} size="sm" color="tertiary" />}
            variant="ghost"
            onClick={goEdit}
          />
        </HStack>

        <HStack gap={2} align="center" justify="between" className="w-full">
          <Text type="supporting" color="secondary">
            {BILLING_CYCLE_META[data.billingCycle].label}
          </Text>
          <Switch
            label={isPaused ? "일시정지됨" : "진행중"}
            labelPosition="start"
            value={!isPaused}
            changeAction={handleToggleActive}
          />
        </HStack>
      </VStack>

      <VStack paddingInline={5}>
        <InfoRow
          label="카테고리"
          value={`${meta.emoji} ${meta.label}`}
          onClick={goEdit}
        />
      </VStack>

      <VStack className="border-t border-gray-200" />

      <VStack paddingInline={5}>
        <InfoRow
          label="결제 주기"
          value={BILLING_CYCLE_META[data.billingCycle].label}
        />
        <InfoRow label="결제일" value={billingText(data)} />
        <InfoRow label="등록일" value={formatDate(data.createdAt)} />
      </VStack>

      {/*
        수정 진입로가 금액 옆 연필 아이콘뿐이라 눈에 잘 띄지 않았다.
        삭제와 나란히 두어 둘 다 하단에서 바로 닿게 한다.
        파괴적인 삭제가 오른쪽에 오도록 순서를 고정한다.
      */}
      <HStack
        className="sticky bottom-0 mt-auto bg-surface"
        paddingInline={4}
        paddingBlock={3}
        gap={2}
      >
        {/* Button은 폭 제어 prop이 없어 flex-1로 반씩 나눠 갖게 한다. */}
        <VStack className="flex-1">
          <Button
            label="수정하기"
            variant="secondary"
            size="lg"
            onClick={goEdit}
          />
        </VStack>
        <VStack className="flex-1">
          <Button
            label="삭제하기"
            variant="destructive"
            size="lg"
            onClick={() => setIsConfirmOpen(true)}
          />
        </VStack>
      </HStack>

      {/*
        여기서의 삭제는 기록을 지우는 것이지 실제 서비스 해지가 아니다.
        (서버도 softDelete라 결제와는 아무 상관이 없다.)
        지웠다고 해지된 줄 알면 결제가 계속 나가므로, 서비스에서 먼저 해지했는지
        확인부터 묻는다.
      */}
      <BottomSheet
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="구독을 해지하셨나요?"
      >
        <VStack paddingInline={4} paddingBlock={2} gap={3}>
          <Text type="body" color="secondary">
            목록에서 지워도 실제 서비스가 해지되지는 않아요. 아직이라면 해당
            서비스에서 먼저 해지해주세요.
          </Text>
          <Button
            label="해지 링크로 넘어가기"
            variant="primary"
            size="lg"
            onClick={() =>
              window.open(data.cancelUrl, "_blank", "noopener,noreferrer")
            }
          />
          <Button
            label="네, 삭제할게요"
            variant="destructive"
            size="lg"
            onClick={handleDelete}
            isDisabled={remove.isPending}
          />
          <Button
            label="취소"
            size="lg"
            onClick={() => setIsConfirmOpen(false)}
          />
        </VStack>
      </BottomSheet>
    </VStack>
  );
}

export default SubscriptionDetailContent;
