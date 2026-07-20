import { VStack } from "@astryxdesign/core/VStack";
import { Button } from "@astryxdesign/core/Button";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <VStack className="flex-1" justify="end" padding={4}>
      <Button
        label="시작하기"
        variant="primary"
        size="lg"
        onClick={() => navigate("/login")}
      />
    </VStack>
  );
}

export default LandingPage;
