import type { ApiResponse } from "../types/api";
import type {
  LoginRequest,
  SignUpRequest,
  SignUpResponseData,
  User,
} from "../types/auth";
import { http } from "./httpClient";

export async function signUp(data: SignUpRequest) {
  const response = await http.post<ApiResponse<SignUpResponseData>>(
    "/api/auth/signup",
    data,
  );
  return response.data;
}

export async function login(data: LoginRequest) {
  const response = await http.post<ApiResponse<{ data: null }>>(
    "/api/auth/login",
    data,
  );
  return response.data;
}

export async function logout() {
  const response =
    await http.post<ApiResponse<{ data: null }>>("/api/auth/logout");
  return response.data;
}

export async function getUser() {
  const response = await http.get<ApiResponse<User>>("/api/auth/me");
  return response.data;
}

export async function changeName(name: string) {
  const response = await http.put<ApiResponse<{ data: null }>>(
    "/api/users/me/name",
    {
      name,
    },
  );

  return response.data;
}

export async function changePassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) {
  const response = await http.put<ApiResponse<{ data: null }>>(
    "/api/users/me/password",
    {
      currentPassword,
      newPassword,
    },
  );

  return response.data;
}

export async function expireUser() {
  const response =
    await http.delete<ApiResponse<{ data: null }>>("/api/users/me");
  return response.data;
}
