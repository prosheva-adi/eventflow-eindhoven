import { useState } from "react";

export function useAuth() {
    const [auth, setAuth] = useState(() => ({
        token: localStorage.getItem("token"),
        user: JSON.parse(localStorage.getItem("user") || "null"),
    }));

    const refresh = () => {
        setAuth({
            token: localStorage.getItem("token"),
            user: JSON.parse(localStorage.getItem("user") || "null"),
        });
    };

    return {
        isLoggedIn: !!auth.token,
        isAdmin:    auth.user?.role === "ADMIN",
        user:       auth.user,
        token:      auth.token,
        refresh,
    };
}