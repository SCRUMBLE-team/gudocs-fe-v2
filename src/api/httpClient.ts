type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface HttpOptions {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: unknown; // JS 객체 or FormData 등
}

async function baseFetch<T>(
  url: string,
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

  const res = await fetch(url, init);

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

    throw {
      status: res.status,
      body: errorBody,
      message: "HTTP Error",
    };
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
