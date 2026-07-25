type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface HttpOptions {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: unknown; // JS 객체 or FormData 등
}

/** 응답이 실패했을 때 baseFetch가 던지는 값. Error 인스턴스가 아니다. */
export interface HttpError {
  status: number;
  body: unknown;
  message: string;
}

/**
 * catch/onError로 넘어온 값이 HTTP 실패인지 판별한다.
 * 던지는 값이 Error가 아니라서 호출부에서 타입 단언을 쓰게 되는 걸 막는다.
 */
export function isHttpError(error: unknown): error is HttpError {
  return (
    typeof error === "object" &&
    error !== null &&
    typeof (error as HttpError).status === "number"
  );
}

// 끝 슬래시 제거 — path의 앞 슬래시와 겹치지 않도록
// OAuth authorize URL처럼 http 래퍼를 거치지 않는 전체 페이지 이동에서도
// 같은 오리진을 써야 해서 공개한다.
export const API_BASE_URL = (import.meta.env.VITE_BASE_URL ?? "").replace(
  /\/+$/,
  "",
);

function resolveUrl(path: string) {
  // 절대 URL이면 그대로 사용
  if (/^https?:\/\//.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function baseFetch<T>(
  path: string,
  options: HttpOptions = {},
): Promise<T> {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  const isFormData = options.body instanceof FormData;

  const headers = isFormData
    ? options.headers // FormData면 브라우저가 Content-Type 설정
    : { ...defaultHeaders, ...(options.headers ?? {}) };

  const init: RequestInit = {
    method: options.method ?? "GET",
    headers,
    body: isFormData
      ? (options.body as BodyInit)
      : options.body
        ? JSON.stringify(options.body)
        : undefined,
    credentials: "include",
  };

  const res = await fetch(resolveUrl(path), init);

  // 공통 에러 처리
  if (!res.ok) {
    // 서버가 에러 바디를 JSON으로 줄 수도, 텍스트로 줄 수도 있음
    const contentType = res.headers.get("Content-Type") ?? "";
    let errorBody: unknown;

    try {
      if (contentType.includes("application/json")) {
        errorBody = await res.json();
      } else {
        errorBody = await res.text();
      }
    } catch {
      errorBody = null;
    }

    const error: HttpError = {
      status: res.status,
      body: errorBody,
      message: "HTTP Error",
    };

    throw error;
  }

  // 204 등 body 없는 경우
  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("Content-Type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }

  // 필요 시 blob/text 등 분기 가능
  return (await res.text()) as T;
}

export const http = {
  get: <T>(url: string, options?: Omit<HttpOptions, "method" | "body">) =>
    baseFetch<T>(url, { ...options, method: "GET" }),

  post: <T>(
    url: string,
    body?: unknown,
    options?: Omit<HttpOptions, "method" | "body">,
  ) => baseFetch<T>(url, { ...options, method: "POST", body }),

  put: <T>(
    url: string,
    body?: unknown,
    options?: Omit<HttpOptions, "method" | "body">,
  ) => baseFetch<T>(url, { ...options, method: "PUT", body }),

  patch: <T>(
    url: string,
    body?: unknown,
    options?: Omit<HttpOptions, "method" | "body">,
  ) => baseFetch<T>(url, { ...options, method: "PATCH", body }),

  delete: <T>(
    url: string,
    body?: unknown,
    options?: Omit<HttpOptions, "method" | "body">,
  ) => baseFetch<T>(url, { ...options, method: "DELETE", body }),
};
