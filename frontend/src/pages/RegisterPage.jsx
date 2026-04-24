import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/api/auth/register", {
                username,
                email,
                password
            });

            // Store token and user info
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify({
                userId: response.data.userId,
                username: response.data.username,
                email: response.data.email
            }));

            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "white" }}>
            <Navbar />

            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "140px",
                paddingBottom: "60px"
            }}>
                <div style={{
                    width: "100%",
                    maxWidth: "420px",
                    padding: "40px",
                    background: "#171717",
                    borderRadius: "12px",
                    border: "1px solid #262626"
                }}>

                    <h2 style={{ textAlign: "center", marginBottom: "8px" }}>
                        Create account
                    </h2>
                    <p style={{ textAlign: "center", color: "#9ca3af", marginBottom: "32px" }}>
                        Join EventFlow today
                    </p>

                    {error && (
                        <div style={{
                            background: "#2a1a1a",
                            border: "1px solid #ff4d4d",
                            color: "#ff4d4d",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            marginBottom: "18px",
                            fontSize: "14px"
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "18px" }}>
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="johndoe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "18px" }}>
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "18px" }}>
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "26px" }}>
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <button type="submit" disabled={loading} style={{
                            ...buttonStyle,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? "not-allowed" : "pointer"
                        }}>
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p style={{ textAlign: "center", marginTop: "24px", color: "#9ca3af" }}>
                        Already have an account?{" "}
                        <Link to="/login" style={{ color: "#6c63ff" }}>Sign in</Link>
                    </p>

                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "6px",
    borderRadius: "8px",
    border: "1px solid #2a2a2a",
    background: "#111",
    color: "white",
    fontSize: "14px"
};

const buttonStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#6c63ff",
    color: "white",
    fontSize: "15px",
    fontWeight: "600",
};

export default RegisterPage;