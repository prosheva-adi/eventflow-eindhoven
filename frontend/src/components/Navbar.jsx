import { Link, useLocation } from "react-router-dom";

function Navbar() {
    const location = useLocation();

    const navLinks = [
        { label: "Map", path: "/" },
        { label: "Events", path: "/events" },
        { label: "Saved", path: "/saved" },
    ];

    return (
        <nav style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: "#0f0f0f",
            borderBottom: "1px solid #222",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
        }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: "linear-gradient(135deg, #6c63ff, #4f46e5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px"
                }}>📍</div>
                <span style={{ fontSize: "18px", fontWeight: "700", color: "white" }}>
                    Event<span style={{ color: "#6c63ff" }}>Flow</span>
                </span>
            </div>

            {/* Nav Links */}
            <div style={{ display: "flex", gap: "32px" }}>
                {navLinks.map(link => (
                    <Link
                        key={link.path}
                        to={link.path}
                        style={{
                            color: location.pathname === link.path ? "#6c63ff" : "#9ca3af",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: "500",
                            transition: "color 0.2s"
                        }}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            {/* Auth Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Link to="/login" style={{
                    color: "white", textDecoration: "none",
                    fontSize: "14px", fontWeight: "500"
                }}>
                    Log in
                </Link>
                <Link to="/register" style={{
                    backgroundColor: "#6c63ff",
                    color: "white",
                    textDecoration: "none",
                    padding: "8px 18px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600"
                }}>
                    Sign up
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;