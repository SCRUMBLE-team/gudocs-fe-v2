import { useRef, type ChangeEvent } from "react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react";
import { useGoBack } from "../../../../hooks/useGoBack";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { List, ListItem } from "@astryxdesign/core/List";
import document from "../../../../assets/lottie/document.json";
import { useToast } from "@astryxdesign/core/Toast";
import {
  ACCEPTED_OCR_IMAGE_TYPES,
  MAX_OCR_IMAGE_BYTES,
} from "../../../../api/ocr";
import { isHttpError } from "../../../../api/httpClient";
import { useScanSubscriptionImageMutation } from "../../../../hooks/query/useScanSubscriptionImageMutation";
import { toConfirmParams } from "../to-subscribe-draft";
import { ImageIcon, PencilIcon } from "./method-icons";
import Lottie from "lottie-react";

function errorMessage(error: unknown) {
  // 401은 QueryCache.onError가 이미 랜딩으로 돌려보낸다. 여기서 다루지 않는다.
  if (!isHttpError(error)) {
    return "인식에 실패했어요. 잠시 후 다시 시도해주세요.";
  }
  if (error.status === 400) {
    return "이미지를 읽을 수 없어요. 다른 이미지를 올려주세요.";
  }
  if (error.status === 502) {
    return "인식 서버가 응답하지 않아요. 잠시 후 다시 시도해주세요.";
  }
  return "인식에 실패했어요. 잠시 후 다시 시도해주세요.";
}

/**
 * 구독 등록 퍼널 0단계 — 이미지로 채울지 직접 입력할지 고른다.
 *
 * 이미지 경로는 OCR 결과를 액티비티 파라미터로 넘겨 확인 화면(SubscribeNewConfirm)
 * 한 곳에서 확인·수정하게 하고, 직접 입력은 기존 2단계 퍼널로 그대로 이어진다.
 */
const SubscribeNewStartActivity: StaticActivityComponentType<
  "SubscribeNewStart"
> = () => {
  const { push } = useFlow();
  const goBack = useGoBack();
  const showToast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useScanSubscriptionImageMutation();

  function showError(body: string) {
    showToast({
      body,
      type: "error",
      isAutoHide: true,
      autoHideDuration: 3000,
    });
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // 같은 파일을 다시 골라도 change가 뜨도록 값을 비운다.
    event.target.value = "";

    if (!file) return;

    // 서버 스펙과 같은 제약을 미리 막는다. 400을 왕복할 이유가 없다.
    if (!ACCEPTED_OCR_IMAGE_TYPES.includes(file.type)) {
      showError("JPG 또는 PNG 이미지만 올릴 수 있어요.");
      return;
    }
    if (file.size > MAX_OCR_IMAGE_BYTES) {
      showError("이미지 용량은 10MB까지 올릴 수 있어요.");
      return;
    }

    mutate(file, {
      onSuccess: (result) => {
        const params = toConfirmParams(result);
        if (Object.keys(params).length === 0) {
          showToast({ body: "인식된 정보가 없어요. 직접 입력해주세요." });
        }
        push("SubscribeNewConfirm", params);
      },
      onError: (error) => showError(errorMessage(error)),
    });
  }

  return (
    <AppScreen>
      <VStack minHeight="100%">
        <HStack paddingInline={2} paddingBlock={2} align="center">
          <IconButton
            label="뒤로 가기"
            icon={<Icon icon="chevronLeft" />}
            variant="ghost"
            onClick={goBack}
          />
        </HStack>

        <VStack paddingInline={4} paddingBlock={2} gap={5}>
          <Heading level={2} className="whitespace-pre-line">
            {"구독을 어떻게 등록할까요?"}
          </Heading>

          {isPending ? (
            <VStack align="center" justify="center" gap={3} paddingBlock={10}>
              <Lottie
                animationData={document}
                loop
                style={{ width: 400, height: 400 }}
              />
              <Text color="secondary">결제 정보를 가져오고 있어요</Text>
            </VStack>
          ) : (
            <List density="spacious">
              <ListItem
                label="이미지로 등록하기"
                description="결제 알림 캡처나 영수증을 올리면 자동으로 채워드려요"
                startContent={
                  <Icon icon={ImageIcon} size="lg" color="accent" />
                }
                endContent={<Icon icon="chevronRight" size="sm" />}
                onClick={() => inputRef.current?.click()}
              />
              <ListItem
                label="직접 입력하기"
                description="카테고리부터 하나씩 골라 등록해요"
                startContent={
                  <Icon icon={PencilIcon} size="lg" color="accent" />
                }
                endContent={<Icon icon="chevronRight" size="sm" />}
                onClick={() => push("SubscribeNew", {})}
              />
            </List>
          )}
        </VStack>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_OCR_IMAGE_TYPES.join(",")}
          className="hidden"
          onChange={handleFileChange}
        />
      </VStack>
    </AppScreen>
  );
};

export default SubscribeNewStartActivity;
