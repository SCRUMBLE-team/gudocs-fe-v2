import { useNavigate } from "react-router-dom";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Button } from "@astryxdesign/core/Button";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { useToast } from "@astryxdesign/core/Toast";
import { isHttpError } from "../../../api/httpClient";
import FixedBottomCTA from "../../../components/fixed-bottom-cta";
import LineTextField from "../../../components/line-field/line-text-field";
import { useChangeNameMutation } from "../../../hooks/query/useChangeNameMutation";
import { generateRandomName } from "../../../utils/random-name";

export type SetNameProps = {
  name: string;
  onChangeName: (value: string) => void;
};

function SetName({ name, onChangeName }: SetNameProps) {
  const navigate = useNavigate();
  const showToast = useToast();
  const { mutate, isPending } = useChangeNameMutation();

  // 제안 이름을 지우고 공백만 남길 수 있으므로 다듬은 값을 기준으로 판단한다.
  const trimmedName = name.trim();

  function handleSubmit() {
    if (!trimmedName || isPending) {
      return;
    }

    mutate(trimmedName, {
      onSuccess: () => {
        // 온보딩은 히스토리에 남기지 않는다. 홈에서 뒤로 가기를 눌렀을 때
        // 이름 설정 화면으로 되돌아오면 안 된다.
        navigate("/", { replace: true });
      },
      onError: (error) => {
        // 세션이 끊긴 상태로 온보딩에 들어온 경우엔 재시도해도 소용없다.
        if (isHttpError(error) && error.status === 401) {
          showToast({
            body: "로그인이 만료됐어요. 다시 로그인해주세요.",
            type: "error",
            isAutoHide: true,
            autoHideDuration: 3000,
          });
          navigate("/login", { replace: true });
          return;
        }

        showToast({
          body: "이름 설정에 실패했어요. 잠시 후 다시 시도해주세요.",
          type: "error",
          isAutoHide: true,
          autoHideDuration: 3000,
        });
      },
    });
  }

  return (
    <VStack className="flex-1">
      <VStack paddingInline={4} paddingBlock={6} gap={5}>
        <VStack gap={2}>
          <Heading level={2} className="whitespace-pre-line">
            {"어떤 이름으로\n부를까요?"}
          </Heading>
          <Text type="body" color="secondary">
            마음에 드는 이름을 골라주세요. 나중에 바꿀 수 있어요.
          </Text>
        </VStack>

        <VStack gap={1}>
          <LineTextField
            label="닉네임"
            value={name}
            onChange={onChangeName}
            placeholder="이름을 입력해주세요"
          />
          <HStack justify="end">
            <Button
              label="다른 이름 추천받기"
              variant="ghost"
              size="sm"
              onClick={() => onChangeName(generateRandomName(name))}
            />
          </HStack>
        </VStack>
      </VStack>

      {trimmedName && (
        <FixedBottomCTA
          label="시작하기"
          onClick={handleSubmit}
          isDisabled={isPending}
        />
      )}
    </VStack>
  );
}

export default SetName;
