import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const isLoggedIn = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const navLinks = [
        { label: "Map", path: "/" },
        { label: "Events", path: "/events" },
        { label: "Saved", path: "/saved" },
        { label: "Venues", path: "/venues" },

    ];

    return (
        <nav style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backdropFilter: "blur(10px)",
            background: "rgba(15,15,15,0.75)",
            borderBottom: "1px solid #222",
        }}>
            <div style={{
                maxWidth: "1400px",
                margin: "0 auto",
                height: "72px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 32px"
            }}>

                {/* LEFT — LOGO */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #6c63ff, #4f46e5)",
                        boxShadow: "0 4px 14px rgba(108,99,255,0.4)"
                    }}/>
                    <span style={{ fontSize: "22px", fontWeight: "700", color: "white" }}>
                        Event<span style={{ color: "#6c63ff" }}>Flow</span>
                    </span>
                </div>

                {/* CENTER — NAV LINKS */}
                <div style={{ display: "flex", gap: "36px" }}>
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            style={{
                                color: location.pathname === link.path ? "#6c63ff" : "#9ca3af",
                                textDecoration: "none",
                                fontSize: "16px",
                                fontWeight: "600",
                                letterSpacing: "0.3px",
                                transition: "all 0.2s ease"
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* RIGHT — AUTH */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {isLoggedIn ? (
                        <>
                            <span style={{ color: "#9ca3af", fontSize: "15px" }}>
                                Hi, <span style={{ color: "white", fontWeight: "600" }}>{user?.username}</span>
                            </span>
                            <button onClick={handleLogout} style={{
                                background: "transparent",
                                color: "#e5e7eb",
                                border: "1px solid #333",
                                padding: "10px 18px",
                                borderRadius: "10px",
                                fontSize: "15px",
                                fontWeight: "600",
                                cursor: "pointer"
                            }}>
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{
                                color: "#e5e7eb",
                                textDecoration: "none",
                                fontSize: "15px",
                                fontWeight: "600"
                            }}>
                                Log in
                            </Link>
                            <Link to="/register" style={{
                                background: "linear-gradient(135deg, #6c63ff, #4f46e5)",
                                color: "white",
                                textDecoration: "none",
                                padding: "10px 18px",
                                borderRadius: "10px",
                                fontSize: "15px",
                                fontWeight: "700",
                                boxShadow: "0 4px 14px rgba(108,99,255,0.35)"
                            }}>
                                Sign up
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </nav>
    );
}

export default Navbar;