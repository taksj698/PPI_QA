import axios, { InternalAxiosRequestConfig } from "axios";
import { ENV } from "@/config/env";

const api = axios.create({
  baseURL: `${ENV.API_URL}${ENV.API_PREFIX}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // ป้องกัน request ค้าง
});

// ✅ Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log("ENV URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log(`${ENV.API_URL}${ENV.API_PREFIX}`)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return config;
  }
);

// ✅ Response Interceptor (optional แต่แนะนำ)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token หมดอายุ
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
