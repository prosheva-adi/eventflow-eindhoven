import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

    @keyframes fadeUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }

    .up * { box-sizing: border-box; margin: 0; padding: 0; }
    .up { min-height: 100vh; background: #0d0d0d; color: #f0ede8; font-family: 'DM Sans', sans-serif; }

    .up-header {
        max-width: 1400px; margin: 0 auto; padding: 72px 40px 0;
        display: flex; justify-content: space-between; align-items: flex-end;
        flex-wrap: wrap; gap: 24px; animation: fadeUp 0.5s ease both;
    }
    .up-title {
        font-family: 'DM Serif Display', serif;
        font-size: clamp(36px, 5vw, 56px); font-weight: 400;
        letter-spacing: -1px; line-height: 1; color: #f5f2ed;
    }
    .up-subtitle { color: #555; font-size: 15px; font-weight: 300; margin-top: 10px; letter-spacing: 0.2px; }

    .up-search-wrap { max-width: 1400px; margin: 36px auto 0; padding: 0 40px; animation: fadeUp 0.5s ease 0.05s both; }
    .up-search {
        width: 100%; padding: 14px 20px 14px 44px; border-radius: 14px;
        border: 1px solid #1e1e1e; background: #111; color: #f0ede8;
        font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s;
    }
    .up-search::placeholder { color: #444; }
    .up-search:focus { border-color: rgba(108,99,255,0.5); }
    .up-search-inner { position: relative; }
    .up-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #444; font-size: 15px; pointer-events: none; }

    .up-table-wrap {
        max-width: 1400px; margin: 40px auto 0; padding: 0 40px 100px;
        animation: fadeUp 0.5s ease 0.1s both;
    }

    .up-table {
        width: 100%; border-collapse: collapse;
    }

    .up-table thead tr {
        border-bottom: 1px solid #1e1e1e;
    }

    .up-table th {
        text-align: left; padding: 12px 16px;
        font-size: 10px; font-weight: 600; color: #444;
        letter-spacing: 1px; text-transform: uppercase;
    }

    .up-table tbody tr {
        border-bottom: 1px solid #161616;
        transition: background 0.15s;
    }
    .up-table tbody tr:hover { background: rgba(255,255,255,0.02); }

    .up-table td {
        padding: 16px 16px; font-size: 14px; color: #aaa; font-weight: 400; vertical-align: middle;
    }

    .up-username { color: #f0ede8; font-weight: 500; }
    .up-email { color: #555; font-size: 13px; }
    .up-date { color: #444; font-size: 13px; }

    .role-badge {
        display: inline-flex; align-items: center;
        padding: 4px 12px; border-radius: 100px;
        font-size: 10px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase;
    }
    .role-badge.admin {
        background: rgba(108,99,255,0.15); border: 1px solid rgba(108,99,255,0.35); color: #9d97ff;
    }
    .role-badge.user {
        background: rgba(255,255,255,0.05); border: 1px solid #222; color: #555;
    }

    .role-btn {
        padding: 7px 16px; border-radius: 8px; border: none; cursor: pointer;
        font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
        letter-spacing: 0.3px; transition: opacity 0.2s, transform 0.15s;
    }
    .role-btn.promote {
        background: linear-gradient(135deg, #6c63ff 0%, #8b84ff 100%);
        color: white; box-shadow: 0 2px 12px rgba(108,99,255,0.3);
    }
    .role-btn.promote:hover { opacity: 0.85; transform: translateY(-1px); }
    .role-btn.demote {
        background: #1a1a1a; border: 1px solid #2a2a2a; color: #666;
    }
    .role-btn.demote:hover { background: #222; color: #999; }
    .role-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

    .up-state { text-align: center; padding: 80px 0; color: #444; font-size: 15px; font-weight: 300; }

    @media (max-width: 768px) {
        .up-header { padding: 56px 24px 0; }
        .up-search-wrap { padding: 0 24px; }
        .up-table-wrap { padding: 0 24px 80px; }
        .up-table th:nth-child(3), .up-table td:nth-child(3) { display: none; }
    }

    @media (max-width: 480px) {
        .up-table th:nth-child(2), .up-table td:nth-child(2) { display: none; }
    }
`;

export default function AdminUsersPage() {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        if (!isAdmin) navigate("/");
    }, [isAdmin]);

    useEffect(() => {
        api.get("/api/users")
            .then(res => setUsers(res.data))
            .catch(err => console.error("Failed to fetch users:", err))
            .finally(() => setLoading(false));
    }, []);

    const handleRoleToggle = async (user) => {
        const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
        setUpdating(user.id);
        try {
            const res = await api.patch(`/api/users/${user.id}/role?role=${newRole}`);
            setUsers(prev => prev.map(u => u.id === user.id ? res.data : u));
        } catch (err) {
            console.error("Failed to update role:", err);
        } finally {
            setUpdating(null);
        }
    };

    const filtered = users.filter(u =>
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    };

    return (
        <>
            <style>{styles}</style>
            <div className="up">

                <div className="up-header">
                    <div>
                        <h1 className="up-title">Users</h1>
                        <p className="up-subtitle">{users.length} registered {users.length === 1 ? "user" : "users"}</p>
                    </div>
                </div>

                <div className="up-search-wrap">
                    <div className="up-search-inner">
                        <span className="up-search-icon">⌕</span>
                        <input
                            className="up-search"
                            placeholder="Search by username or email…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="up-table-wrap">
                    {loading && <p className="up-state">Loading users…</p>}
                    {!loading && filtered.length === 0 && (
                        <p className="up-state">{search ? `No users matching "${search}"` : "No users yet."}</p>
                    )}
                    {!loading && filtered.length > 0 && (
                        <table className="up-table">
                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Joined</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map(user => (
                                <tr key={user.id}>
                                    <td className="up-username">{user.username}</td>
                                    <td className="up-email">{user.email}</td>
                                    <td className="up-date">{formatDate(user.createdAt)}</td>
                                    <td>
                                            <span className={`role-badge ${user.role === "ADMIN" ? "admin" : "user"}`}>
                                                {user.role}
                                            </span>
                                    </td>
                                    <td>
                                        <button
                                            className={`role-btn ${user.role === "ADMIN" ? "demote" : "promote"}`}
                                            onClick={() => handleRoleToggle(user)}
                                            disabled={updating === user.id}
                                        >
                                            {updating === user.id
                                                ? "Saving…"
                                                : user.role === "ADMIN" ? "Demote" : "Make Admin"
                                            }
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}