import { Link, useLocation, useNavigate } from "react-router-dom";
import {useAuth} from "../hooks/useAuth.js";

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

    .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    font-family: 'DM Sans', sans-serif;
    background: rgba(13,13,13,0.8);           /* ← move here */
    backdrop-filter: blur(20px);              /* ← move here */
    -webkit-backdrop-filter: blur(20px);      /* ← move here */
    border-bottom: 1px solid rgba(255,255,255,0.05); /* ← move here too */
    }

    /* Frosted glass bar */
    .nav-inner {
    max-width: 1400px;
    margin: 0 auto;
    height: 66px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    }
 

    /* ── Logo ── */
    .nav-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        flex-shrink: 0;
    }
    .nav-logo-mark {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        background: linear-gradient(135deg, #6c63ff, #4f46e5);
        box-shadow: 0 0 14px rgba(108,99,255,0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        line-height: 1;
    }
    .nav-logo-text {
        font-family: 'DM Serif Display', serif;
        font-size: 20px;
        font-weight: 400;
        color: #f5f2ed;
        letter-spacing: -0.3px;
    }
    .nav-logo-text em {
        font-style: italic;
        color: #9d97ff;
    }

    /* ── Nav links ── */
    .nav-links {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    .nav-link {
        position: relative;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        color: #555;
        padding: 7px 14px;
        border-radius: 8px;
        transition: color 0.2s, background 0.2s;
        letter-spacing: 0.2px;
    }
    .nav-link:hover {
        color: #999;
        background: rgba(255,255,255,0.04);
    }
    .nav-link.active {
        color: #f0ede8;
        background: rgba(255,255,255,0.06);
    }
    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: 16px;
        height: 2px;
        border-radius: 2px;
        background: #6c63ff;
        box-shadow: 0 0 6px rgba(108,99,255,0.6);
    }

    /* ── Auth area ── */
    .nav-auth {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
    }
    .nav-greeting {
        font-size: 13px;
        color: #444;
        font-weight: 400;
    }
    .nav-greeting strong {
        color: #888;
        font-weight: 500;
    }
    .nav-logout {
        background: transparent;
        color: #555;
        border: 1px solid #222;
        padding: 8px 16px;
        border-radius: 8px;
        font-family: 'DM Sans', sans-serif;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: color 0.2s, border-color 0.2s, background 0.2s;
        letter-spacing: 0.2px;
    }
    .nav-logout:hover {
        color: #f0ede8;
        border-color: #333;
        background: rgba(255,255,255,0.04);
    }
    .nav-login {
        text-decoration: none;
        color: #666;
        font-size: 13px;
        font-weight: 500;
        padding: 8px 14px;
        border-radius: 8px;
        transition: color 0.2s;
        letter-spacing: 0.2px;
    }
    .nav-login:hover { color: #999; }

    .nav-signup {
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        padding: 8px 18px;
        border-radius: 8px;
        background: linear-gradient(135deg, #6c63ff, #8b84ff);
        color: white;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.2px;
        box-shadow: 0 2px 14px rgba(108,99,255,0.3);
        transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    }
    .nav-signup:hover {
        opacity: 0.9;
        transform: translateY(-1px);
        box-shadow: 0 4px 20px rgba(108,99,255,0.45);
    }

    @media (max-width: 700px) {
        .nav-inner { padding: 0 20px; }
        .nav-links { gap: 0; }
        .nav-link { padding: 7px 10px; font-size: 13px; }
        .nav-greeting { display: none; }
    }
`;

const NAV_LINKS = [
    { label: "Map",    path: "/" },
    { label: "Events", path: "/events" },
    { label: "Saved",  path: "/saved" },
    { label: "Venues", path: "/venues", adminOnly: true },
];

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const { isLoggedIn, isAdmin, user } = useAuth();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <>
            <style>{styles}</style>
            <nav className="nav">
                <div className="nav-inner">

                    {/* Logo */}
                    <Link to="/" className="nav-logo">
                        <div className="nav-logo-mark">✦</div>
                        <span className="nav-logo-text">Event<em>Flow</em></span>
                    </Link>

                    {/* Links */}
                    <div className="nav-links">
                        {NAV_LINKS.filter(link => !link.adminOnly || isAdmin).map(({ label, path }) => (
                            <Link
                                key={path}
                                to={path}
                                className={`nav-link${location.pathname === path ? " active" : ""}`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth */}
                    <div className="nav-auth">
                        {isLoggedIn ? (
                            <>
                                {user?.username && (
                                    <span className="nav-greeting">
                                        Hi, <strong>{user.username}</strong>
                                    </span>
                                )}
                                <button className="nav-logout" onClick={handleLogout}>
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="nav-login">Log in</Link>
                                <Link to="/register" className="nav-signup">Sign up</Link>
                            </>
                        )}
                    </div>

                </div>
            </nav>
        </>
    );
}

export default Navbar;