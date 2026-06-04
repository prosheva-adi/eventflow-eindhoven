import { useState, useEffect } from "react";

export function useAuth() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

    useEffect(() => {
        const handleStorage = () => {
            setToken(localStorage.getItem("token"));
            setUser(JSON.parse(localStorage.getItem("user") || "null"));
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    return {
        isLoggedIn: !!token,
        isAdmin:    user?.role === "ADMIN",
        user,
        token,
    };
}