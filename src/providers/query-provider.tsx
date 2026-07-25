import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { isHttpError } from "../api/httpClient";

// 렌더 본문에서 만들면 리렌더마다 캐시가 통째로 날아가, 가드가 그때마다
// /me를 다시 부르며 화면이 스피너로 깜빡인다. 모듈 레벨에서 한 번만 만든다.
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // 사용 중 세션이 끊기면 유저 캐시를 비워 가드가 랜딩으로 보내게 한다.
      // onError는 쿼리가 실패한 시점에만 불리므로 queryClient는 이미 할당돼 있다.
      if (isHttpError(error) && error.status === 401) {
        queryClient.setQueryData(["user"], null);
      }
    },
  }),
});

function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default QueryProvider;
