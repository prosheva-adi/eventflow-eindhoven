export function useAuth() {
    const token = localStorage.getItem("token");
    const user  = JSON.parse(localStorage.getItem("user") || "null");

    return {
        isLoggedIn: !!token,
        isAdmin:    user?.role === "ADMIN",
        user,
        token,
    };
}