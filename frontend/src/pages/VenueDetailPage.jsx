import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const VENUE_CATEGORIES = [
    "CLUB", "BAR", "CONCERT_HALL", "THEATRE", "OUTDOOR", "GALLERY", "STADIUM", "OTHER"
];

function fieldStyle(hasError) {
    return {
        width: "100%",
        padding: "12px 16px",
        borderRadius: "10px",
        border: hasError ? "1px solid #ef4444" : "1px solid #2a2a2a",
        background: "#111",
        color: "white",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s"
    };
}

function Label({ children }) {
    return (
        <label style={{
            display: "block", fontSize: "12px", fontWeight: "600",
            color: "#9ca3af", marginBottom: "6px",
            letterSpacing: "0.5px", textTransform: "uppercase"
        }}>
            {children}
        </label>
    );
}

export default function VenueDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        api.get(`/api/venues/${id}`)
            .then(res => {
                setVenue(res.data);
                setForm(res.data);
            })
            .catch(err => setError(err.response?.data?.message || "Venue not found"))
            .finally(() => setLoading(false));
    }, [id]);

    const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const handleSave = async () => {
        setSaving(true);
        setSaveError(null);
        try {
            const res = await api.put(`/api/venues/${id}`, {
                name: form.name,
                description: form.description || null,
                address: form.address,
                latitude: parseFloat(form.latitude),
                longitude: parseFloat(form.longitude),
                imageUrl: form.imageUrl || null,
                website: form.website || null,
                category: form.category
            });
            setVenue(res.data);
            setEditing(false);
        } catch (err) {
            setSaveError(err.response?.data?.message || "Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await api.delete(`/api/venues/${id}`);
            navigate("/venues");
        } catch (err) {
            console.error("Delete failed:", err);
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleCancelEdit = () => {
        setForm(venue);
        setEditing(false);
        setSaveError(null);
    };

    if (loading) return (
        <div style={{ minHeight: "100vh", background: "#0f0f0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#9ca3af" }}>Loading venue...</p>
        </div>
    );

    if (error) return (
        <div style={{ minHeight: "100vh", background: "#0f0f0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#ef4444" }}>{error}</p>
        </div>
    );

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(to bottom, #0f0f0f, #151515)",
            color: "white",
            fontFamily: "sans-serif"
        }}>

            {/* Delete Confirm Modal */}
            {showDeleteConfirm && (
                <div
                    onClick={() => setShowDeleteConfirm(false)}
                    style={{
                        position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
                        zIndex: 1000, display: "flex", alignItems: "center",
                        justifyContent: "center", padding: "24px"
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: "#1a1a1a", borderRadius: "20px",
                            border: "1px solid #3a1a1a", padding: "32px",
                            width: "100%", maxWidth: "400px", textAlign: "center"
                        }}
                    >
                        <div style={{ fontSize: "40px", marginBottom: "16px" }}>🗑️</div>
                        <h2 style={{ margin: "0 0 12px", fontSize: "20px" }}>Delete Venue?</h2>
                        <p style={{ color: "#9ca3af", marginBottom: "28px", fontSize: "14px" }}>
                            This will permanently delete <strong style={{ color: "white" }}>{venue.name}</strong>. This action cannot be undone.
                        </p>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                style={{
                                    flex: 1, padding: "12px", borderRadius: "10px",
                                    border: "1px solid #2a2a2a", background: "transparent",
                                    color: "white", cursor: "pointer", fontSize: "14px"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                style={{
                                    flex: 1, padding: "12px", borderRadius: "10px",
                                    border: "none",
                                    background: deleting ? "#3a3a3a" : "linear-gradient(135deg, #ef4444, #dc2626)",
                                    color: deleting ? "#9ca3af" : "white",
                                    cursor: deleting ? "not-allowed" : "pointer",
                                    fontSize: "14px", fontWeight: "600"
                                }}
                            >
                                {deleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Image */}
            <div style={{ position: "relative", height: "380px", overflow: "hidden" }}>
                <img
                    src={venue.imageUrl || `https://picsum.photos/1200/400?${venue.id}`}
                    alt={venue.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, #0f0f0f 20%, transparent 100%)"
                }} />
                <button
                    onClick={() => navigate("/venues")}
                    style={{
                        position: "absolute", top: "24px", left: "24px",
                        background: "rgba(0,0,0,0.5)", border: "1px solid #333",
                        color: "white", padding: "8px 16px", borderRadius: "8px",
                        cursor: "pointer", fontSize: "14px", backdropFilter: "blur(8px)"
                    }}
                >
                    ← Back
                </button>
            </div>

            {/* Content */}
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 32px 80px" }}>

                {/* Category badge */}
                {venue.category && (
                    <span style={{
                        display: "inline-block", marginBottom: "16px",
                        padding: "4px 14px", borderRadius: "20px",
                        background: "rgba(108,99,255,0.15)", border: "1px solid #6c63ff",
                        color: "#6c63ff", fontSize: "12px", fontWeight: "600"
                    }}>
                        {venue.category.replace("_", " ")}
                    </span>
                )}

                {/* Title row + action buttons */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
                    <h1 style={{ fontSize: "38px", fontWeight: "700", margin: 0 }}>
                        {venue.name}
                    </h1>
                    {!editing && (
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                onClick={() => setEditing(true)}
                                style={{
                                    padding: "10px 20px", borderRadius: "10px",
                                    border: "1px solid #6c63ff", background: "transparent",
                                    color: "#6c63ff", cursor: "pointer",
                                    fontSize: "14px", fontWeight: "600"
                                }}
                            >
                                ✏️ Edit
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                style={{
                                    padding: "10px 20px", borderRadius: "10px",
                                    border: "1px solid #ef4444", background: "transparent",
                                    color: "#ef4444", cursor: "pointer",
                                    fontSize: "14px", fontWeight: "600"
                                }}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* VIEW MODE */}
                {!editing && (
                    <>
                        <div style={{
                            display: "grid", gridTemplateColumns: "1fr 1fr",
                            gap: "16px", marginBottom: "32px"
                        }}>
                            {[
                                { icon: "📍", label: "Address", value: venue.address },
                                { icon: "🗺️", label: "Coordinates", value: `${venue.latitude}, ${venue.longitude}` },
                                venue.website && { icon: "🌐", label: "Website", value: venue.website, isLink: true },
                            ].filter(Boolean).map(({ icon, label, value, isLink }) => (
                                <div key={label} style={{
                                    background: "#1a1a1a", borderRadius: "12px",
                                    border: "1px solid #2a2a2a", padding: "16px"
                                }}>
                                    <p style={{ color: "#9ca3af", fontSize: "12px", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                        {icon} {label}
                                    </p>
                                    {isLink ? (
                                        <a href={value} target="_blank" rel="noreferrer"
                                           style={{ color: "#6c63ff", fontWeight: "600", fontSize: "14px" }}>
                                            {value}
                                        </a>
                                    ) : (
                                        <p style={{ margin: 0, fontWeight: "600", fontSize: "15px" }}>{value}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {venue.description && (
                            <div style={{ marginBottom: "32px" }}>
                                <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>About</h2>
                                <p style={{ color: "#d1d5db", lineHeight: "1.7", margin: 0 }}>
                                    {venue.description}
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* EDIT MODE */}
                {editing && (
                    <div style={{
                        background: "#1a1a1a", borderRadius: "16px",
                        border: "1px solid #2a2a2a", padding: "28px",
                        marginBottom: "32px"
                    }}>
                        <h2 style={{ margin: "0 0 24px", fontSize: "18px" }}>Edit Venue</h2>

                        <div style={{ marginBottom: "20px" }}>
                            <Label>Venue Name *</Label>
                            <input value={form.name || ""} onChange={e => set("name", e.target.value)}
                                   style={fieldStyle(false)}
                                   onFocus={e => e.target.style.borderColor = "#6c63ff"}
                                   onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <Label>Category *</Label>
                            <select value={form.category || ""} onChange={e => set("category", e.target.value)}
                                    style={{ ...fieldStyle(false), colorScheme: "dark" }}>
                                {VENUE_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat.replace("_", " ")}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <Label>Address *</Label>
                            <input value={form.address || ""} onChange={e => set("address", e.target.value)}
                                   style={fieldStyle(false)}
                                   onFocus={e => e.target.style.borderColor = "#6c63ff"}
                                   onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                            <div>
                                <Label>Latitude *</Label>
                                <input type="number" step="any" value={form.latitude || ""}
                                       onChange={e => set("latitude", e.target.value)}
                                       style={fieldStyle(false)}
                                       onFocus={e => e.target.style.borderColor = "#6c63ff"}
                                       onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
                            </div>
                            <div>
                                <Label>Longitude *</Label>
                                <input type="number" step="any" value={form.longitude || ""}
                                       onChange={e => set("longitude", e.target.value)}
                                       style={fieldStyle(false)}
                                       onFocus={e => e.target.style.borderColor = "#6c63ff"}
                                       onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
                            </div>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <Label>Website</Label>
                            <input value={form.website || ""} onChange={e => set("website", e.target.value)}
                                   style={fieldStyle(false)}
                                   onFocus={e => e.target.style.borderColor = "#6c63ff"}
                                   onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <Label>Image URL</Label>
                            <input value={form.imageUrl || ""} onChange={e => set("imageUrl", e.target.value)}
                                   style={fieldStyle(false)}
                                   onFocus={e => e.target.style.borderColor = "#6c63ff"}
                                   onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <Label>Description</Label>
                            <textarea value={form.description || ""} onChange={e => set("description", e.target.value)}
                                      rows={4}
                                      style={{ ...fieldStyle(false), resize: "vertical", fontFamily: "sans-serif" }}
                                      onFocus={e => e.target.style.borderColor = "#6c63ff"}
                                      onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
                        </div>

                        {saveError && (
                            <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "16px" }}>{saveError}</p>
                        )}

                        <div style={{ display: "flex", gap: "12px" }}>
                            <button onClick={handleCancelEdit} style={{
                                flex: 1, padding: "12px", borderRadius: "10px",
                                border: "1px solid #2a2a2a", background: "transparent",
                                color: "white", cursor: "pointer", fontSize: "14px"
                            }}>
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving} style={{
                                flex: 2, padding: "12px", borderRadius: "10px", border: "none",
                                background: saving ? "#3a3a3a" : "linear-gradient(135deg, #6c63ff, #5a52e0)",
                                color: saving ? "#9ca3af" : "white",
                                cursor: saving ? "not-allowed" : "pointer",
                                fontSize: "14px", fontWeight: "600"
                            }}>
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}