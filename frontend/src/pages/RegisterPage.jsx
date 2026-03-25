import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        alert("Registration coming soon");
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
                    <p style={{
                        textAlign: "center",
                        color: "#9ca3af",
                        marginBottom: "32px"
                    }}>
                        Join EventFlow today
                    </p>

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

                        <button type="submit" style={buttonStyle}>
                            Create account
                        </button>
                    </form>

                    <p style={{
                        textAlign: "center",
                        marginTop: "24px",
                        color: "#9ca3af"
                    }}>
                        Already have an account?{" "}
                        <Link to="/login" style={{ color: "#6c63ff" }}>
                            Sign in
                        </Link>
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
    cursor: "pointer"
};

export default RegisterPage;