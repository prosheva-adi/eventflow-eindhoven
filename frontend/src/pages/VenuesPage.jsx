import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const VENUE_CATEGORIES = [
    "CLUB", "BAR", "CONCERT_HALL", "THEATRE", "OUTDOOR", "GALLERY", "STADIUM", "OTHER"
];

const EMPTY_FORM = {
    name: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
    imageUrl: "",
    website: "",
    category: ""
};

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
            display: "block",
            fontSize: "12px",
            fontWeight: "600",
            color: "#9ca3af",
            marginBottom: "6px",
            letterSpacing: "0.5px",
            textTransform: "uppercase"
        }}>
            {children}
        </label>
    );
}

function FieldError({ msg }) {
    if (!msg) return null;
    return <p style={{ color: "#ef4444", fontSize: "12px", margin: "4px 0 0" }}>{msg}</p>;
}

export default function VenuesPage() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        api.get("/api/venues")
            .then(res => setVenues(res.data))
            .catch(err => console.error("Failed to fetch venues:", err))
            .finally(() => setLoading(false));
    }, []);

    const set = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Venue name is required";
        if (!form.address.trim()) e.address = "Address is required";
        if (!form.latitude) e.latitude = "Latitude is required";
        if (!form.longitude) e.longitude = "Longitude is required";
        if (!form.category) e.category = "Category is required";
        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }

        setSubmitting(true);
        setSubmitError(null);

        const payload = {
            name: form.name,
            description: form.description || null,
            address: form.address,
            latitude: parseFloat(form.latitude),
            longitude: parseFloat(form.longitude),
            imageUrl: form.imageUrl || null,
            website: form.website || null,
            category: form.category
        };

        try {
            const res = await api.post("/api/venues", payload);
            setVenues(prev => [res.data, ...prev]);
            handleClose();
        } catch (err) {
            setSubmitError(err.response?.data?.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setForm(EMPTY_FORM);
        setErrors({});
        setSubmitError(null);
    };

    const filtered = venues.filter(v =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.address.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(to bottom, #0f0f0f, #151515)",
            color: "white",
            fontFamily: "sans-serif"
        }}>

            {/* Add Venue Modal */}
            {showModal && (
                <div
                    onClick={handleClose}
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
                            border: "1px solid #2a2a2a", padding: "32px",
                            width: "100%", maxWidth: "560px",
                            maxHeight: "90vh", overflowY: "auto"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Add New Venue</h2>
                            <button onClick={handleClose} style={{
                                background: "#2a2a2a", border: "none", color: "#9ca3af",
                                width: "32px", height: "32px", borderRadius: "50%",
                                cursor: "pointer", fontSize: "16px", display: "flex",
                                alignItems: "center", justifyContent: "center"
                            }}>✕</button>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <Label>Venue Name *</Label>
                            <input value={form.name} onChange={e => set("name", e.target.value)}
                                   placeholder="e.g. Club Shelter" style={fieldStyle(errors.name)}
                                   onFocus={e => { if (!errors.name) e.target.style.borderColor = "#6c63ff"; }}
                                   onBlur={e => { if (!errors.name) e.target.style.borderColor = "#2a2a2a"; }} />
                            <FieldError msg={errors.name} />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <Label>Category *</Label>
                            <select value={form.category} onChange={e => set("category", e.target.value)}
                                    style={{ ...fieldStyle(errors.category), colorScheme: "dark" }}>
                                <option value="">Select a category</option>
                                {VENUE_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat.replace("_", " ")}</option>
                                ))}
                            </select>
                            <FieldError msg={errors.category} />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <Label>Address *</Label>
                            <input value={form.address} onChange={e => set("address", e.target.value)}
                                   placeholder="e.g. Stratumseind 1, Eindhoven" style={fieldStyle(errors.address)}
                                   onFocus={e => { if (!errors.address) e.target.style.borderColor = "#6c63ff"; }}
                                   onBlur={e => { if (!errors.address) e.target.style.borderColor = "#2a2a2a"; }} />
                            <FieldError msg={errors.address} />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                            <div>
                                <Label>Latitude *</Label>
                                <input type="number" step="any" value={form.latitude}
                                       onChange={e => set("latitude", e.target.value)}
                                       placeholder="51.4381" style={fieldStyle(errors.latitude)}
                                       onFocus={e => { if (!errors.latitude) e.target.style.borderColor = "#6c63ff"; }}
                                       onBlur={e => { if (!errors.latitude) e.target.style.borderColor = "#2a2a2a"; }} />
                                <FieldError msg={errors.latitude} />
                            </div>
                            <div>
                                <Label>Longitude *</Label>
                                <input type="number" step="any" value={form.longitude}
                                       onChange={e => set("longitude", e.target.value)}
                                       placeholder="5.4752" style={fieldStyle(errors.longitude)}
                                       onFocus={e => { if (!errors.longitude) e.target.style.borderColor = "#6c63ff"; }}
                                       onBlur={e => { if (!errors.longitude) e.target.style.borderColor = "#2a2a2a"; }} />
                                <FieldError msg={errors.longitude} />
                            </div>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <Label>Website</Label>
                            <input value={form.website} onChange={e => set("website", e.target.value)}
                                   placeholder="https://venue.example.com" style={fieldStyle(false)}
                                   onFocus={e => e.target.style.borderColor = "#6c63ff"}
                                   onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <Label>Image URL</Label>
                            <input value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)}
                                   placeholder="https://..." style={fieldStyle(false)}
                                   onFocus={e => e.target.style.borderColor = "#6c63ff"}
                                   onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
                        </div>

                        <div style={{ marginBottom: "28px" }}>
                            <Label>Description</Label>
                            <textarea value={form.description} onChange={e => set("description", e.target.value)}
                                      placeholder="Tell people about this venue..."
                                      rows={3}
                                      style={{ ...fieldStyle(false), resize: "vertical", fontFamily: "sans-serif" }}
                                      onFocus={e => e.target.style.borderColor = "#6c63ff"}
                                      onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
                        </div>

                        {submitError && (
                            <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "16px", textAlign: "center" }}>
                                {submitError}
                            </p>
                        )}

                        <button onClick={handleSubmit} disabled={submitting} style={{
                            width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                            background: submitting ? "#3a3a3a" : "linear-gradient(135deg, #6c63ff, #5a52e0)",
                            color: submitting ? "#9ca3af" : "white",
                            fontSize: "15px", fontWeight: "600",
                            cursor: submitting ? "not-allowed" : "pointer"
                        }}>
                            {submitting ? "Creating..." : "Create Venue"}
                        </button>
                    </div>
                </div>
            )}

            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "120px 32px 80px" }}>

                {/* Header */}
                <div style={{
                    marginBottom: "48px", display: "flex",
                    justifyContent: "space-between", alignItems: "flex-start",
                    flexWrap: "wrap", gap: "16px"
                }}>
                    <div>
                        <h1 style={{ fontSize: "36px", fontWeight: "700", margin: "0 0 12px" }}>Venues</h1>
                        <p style={{ color: "#9ca3af", margin: 0 }}>Explore all venues in Eindhoven</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{
                            display: "flex", alignItems: "center", gap: "8px",
                            padding: "12px 24px", borderRadius: "12px", border: "none",
                            background: "linear-gradient(135deg, #6c63ff, #5a52e0)",
                            color: "white", fontSize: "14px", fontWeight: "600",
                            cursor: "pointer", whiteSpace: "nowrap"
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(108,99,255,0.4)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        <span style={{ fontSize: "18px", lineHeight: 1 }}>+</span> Add Venue
                    </button>
                </div>

                {/* Search */}
                <div style={{ marginBottom: "40px" }}>
                    <input
                        placeholder="Search venues..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: "100%", padding: "14px 18px", borderRadius: "12px",
                            border: "1px solid #222", background: "#1a1a1a",
                            color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box"
                        }}
                    />
                </div>

                {loading && (
                    <p style={{ color: "#9ca3af", textAlign: "center", marginTop: "60px" }}>Loading venues...</p>
                )}

                {!loading && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                        gap: "24px"
                    }}>
                        {filtered.length === 0 && (
                            <p style={{ color: "#9ca3af", gridColumn: "1/-1", textAlign: "center", marginTop: "40px" }}>
                                No venues found.
                            </p>
                        )}
                        {filtered.map(venue => (
                            <Link key={venue.id} to={`/venues/${venue.id}`} style={{
                                textDecoration: "none", color: "white",
                                background: "#181818", borderRadius: "16px",
                                overflow: "hidden", border: "1px solid #222",
                                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                                display: "block"
                            }}
                                  onMouseEnter={e => {
                                      e.currentTarget.style.transform = "translateY(-6px)";
                                      e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)";
                                  }}
                                  onMouseLeave={e => {
                                      e.currentTarget.style.transform = "translateY(0)";
                                      e.currentTarget.style.boxShadow = "none";
                                  }}
                            >
                                <div style={{ position: "relative" }}>
                                    <img
                                        src={venue.imageUrl || `https://picsum.photos/400/200?${venue.id}`}
                                        alt={venue.name}
                                        style={{ width: "100%", height: "160px", objectFit: "cover" }}
                                    />
                                    <div style={{
                                        position: "absolute", inset: 0,
                                        background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)"
                                    }} />
                                    <span style={{
                                        position: "absolute", top: "12px", right: "12px",
                                        padding: "4px 10px", borderRadius: "20px",
                                        background: "rgba(108,99,255,0.85)",
                                        color: "white", fontSize: "11px", fontWeight: "600"
                                    }}>
                                        {venue.category?.replace("_", " ")}
                                    </span>
                                </div>
                                <div style={{ padding: "16px" }}>
                                    <h3 style={{ fontSize: "17px", fontWeight: "600", margin: "0 0 8px" }}>
                                        {venue.name}
                                    </h3>
                                    <p style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 6px" }}>
                                        📍 {venue.address}
                                    </p>
                                    {venue.description && (
                                        <p style={{
                                            color: "#6b7280", fontSize: "13px", margin: 0,
                                            overflow: "hidden", display: "-webkit-box",
                                            WebkitLineClamp: 2, WebkitBoxOrient: "vertical"
                                        }}>
                                            {venue.description}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
