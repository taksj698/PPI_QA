import api from "@/lib/api"
import type { ApiResponse } from "@/types/api.types"
import type {
    LoginData,
    LoginRequest,
    LoginResponse,
} from "@/features/login/auth.types";


export const authService = {
    async login(payload: LoginRequest): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>(
            "/Auth/login",
            payload
        )
        return response.data;
    },
    logout() {
        if (typeof window !== "undefined") {
            // ลบ cookie token
            document.cookie =
                `token=; path=/; expires=${new Date(0).toUTCString()}`;
            // ลบ user data
            localStorage.removeItem("user");

            // redirect ไปหน้า login
            window.location.href = "/login";
        }
    }

}