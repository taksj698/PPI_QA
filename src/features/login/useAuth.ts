"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "./auth.service";

export const useAuth = () => {
    const router = useRouter();

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await authService.login({
                userName,
                password1: password,
                companyId: "",
                branchId: "",
            });
            if (res.isSuccess) {
                document.cookie = `token=${res.data.token}; path=/`;
                localStorage.setItem(
                    "user",
                    JSON.stringify(res.data.userData)
                );
                router.push("/qc");
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError("Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        userName,
        password,
        setUserName,
        setPassword,
        handleLogin,
        isLoading,
        error,
    };
};
