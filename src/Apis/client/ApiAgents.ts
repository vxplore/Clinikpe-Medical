import axios from "axios";
import type { ApiSuccess, ApiFailure } from "./ApiAgents.types";
import { ApiError } from "./ApiError";
// import { redirectToLogin } from "./authManager";
/* =======================
   AXIOS INSTANCE
======================= */

const axiosInstance = axios.create({
  baseURL: "https://api.clinikpe.com/",
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

/* =======================
   API REQUEST CONFIG
======================= */

type ApiRequestConfig = {
  url: string;
  method?: "get" | "post" | "put" | "patch" | "delete";
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};
/* =======================
   RESPONSE INTERCEPTOR
======================= */
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       redirectToLogin();
//     }

//     return Promise.reject(error);
//   }
// );

/* =======================
   API REQUEST FUNCTION
======================= */

export async function apiRequest<T>(
  config: ApiRequestConfig
): Promise<ApiSuccess<T>> {
  try {
    const response = await axiosInstance({
      url: config.url,
      method: config.method ?? "get",
      data: config.data,
      params: config.params,
      headers: config.headers,
      signal: config.signal,
    });

    return response.data as ApiSuccess<T>;
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw new ApiError(
        "Something went wrong",
        0,
        undefined,
        false,
        true
      );
    }

    const status = error.response?.status ?? 0;
    const payload = error.response?.data as ApiFailure | undefined;

    throw new ApiError(
      payload?.message ?? error.message ?? "Something went wrong",
      payload?.httpStatus ?? status,
      payload?.errors,
      status === 401,
      status === 0
    );
  }
}
