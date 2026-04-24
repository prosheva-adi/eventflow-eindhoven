import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";


const CATEGORIES = [
    "MUSIC", "FOOD", "SPORTS", "ART", "TECH", "COMEDY", "NETWORKING", "OTHER"
];

const EMPTY_FORM = {
    name: "",
    startDate: "",
    startTime: "",
    endTime: "",
    ticketPrice: "",
    ticketUrl: "",
    imageUrl: "",
    description: "",
    organiserName: "",
    categories: []
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

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        api.get("/api/events")
            .then(res => {

                setEvents(res.data);
            })
            .catch(err => {
                console.error("Failed to fetch events:", err);
            })
            .finally(() => setLoading(false));
    }, []);

    const set = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
    };

    const toggleCategory = (cat) => {
        setForm(prev => ({
            ...prev,
            categories: prev.categories.includes(cat)
                ? prev.categories.filter(c => c !== cat)
                : [...prev.categories, cat]
        }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Event name is required";
        if (!form.startDate) e.startDate = "Start date is required";
        if (!form.startTime) e.startTime = "Start time is required";
        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length > 0) {
            setErrors(e);
            return;
        }

        setSubmitting(true);
        setSubmitError(null);

        const payload = {
            name: form.name,
            startDate: form.startDate,
            startTime: form.startTime,
            endTime: form.endTime || null,
            ticketPrice: form.ticketPrice ? parseFloat(form.ticketPrice) : null,
            ticketUrl: form.ticketUrl || null,
            imageUrl: form.imageUrl || null,
            description: form.description || null,
            organiserName: form.organiserName || null,
            categories: form.categories
        };

        try {
            const res = await api.post("/api/events", payload);

            setEvents(prev => [res.data, ...prev]);
            handleClose();
        } catch (err) {
            console.error(err);
            setSubmitError(
                err.response?.data?.message || "Something went wrong"
            );
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

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(to bottom, #0f0f0f, #151515)",
            color: "white",
            fontFamily: "sans-serif"
        }}>

            {showModal && (
                <div
                    onClick={handleClose}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.8)",
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "24px"
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: "#1a1a1a",
                            borderRadius: "20px",
                            border: "1px solid #2a2a2a",
                            padding: "32px",
                            width: "100%",
                            maxWidth: "560px",
                            maxHeight: "90vh",
                            overflowY: "auto"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Add New Event</h2>
                            <button
                                onClick={handleClose}
                                style={{
                                    background: "#2a2a2a", border: "none", color: "#9ca3af",
                                    width: "32px", height: "32px", borderRadius: "50%",
                                    cursor: "pointer", fontSize: "16px", display: "flex",
                                    alignItems: "center", justifyContent: "center"
                                }}
                            >✕</button>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <Label>Event Name *</Label>
                            <input value={form.name} onChange={e => set("name", e.target.value)}
                                   placeholder="e.g. Techno Night" style={fieldStyle(errors.name)}
                                   onFocus={e => { if (!errors.name) e.target.style.borderColor = "#6c63ff"; }}
                                   onBlur={e => { if (!errors.name) e.target.style.borderColor = "#2a2a2a"; }} />
                            <FieldError msg={errors.name} />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                            <div>
                                <Label>Start Date *</Label>
                                <input type="date" value={form.startDate} onChange={e => set("startDate", e.target.value)}
                                       style={{ ...fieldStyle(errors.startDate), colorScheme: "dark" }} />
                                <FieldError msg={errors.startDate} />
                            </div>
                            <div>
                                <Label>Start Time *</Label>
                                <input type="time" value={form.startTime} onChange={e => set("startTime", e.target.value)}
                                       style={{ ...fieldStyle(errors.startTime), colorScheme: "dark" }} />
                                <FieldError msg={errors.startTime} />
                            </div>
                            <div>
                                <Label>End Time</Label>
                                <input type="time" value={form.endTime} onChange={e => set("endTime", e.target.value)}
                                       style={{ ...fieldStyle(false), colorScheme: "dark" }} />
                            </div>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <Label>Organiser Name</Label>
                            <input value={form.organiserName} onChange={e => set("organiserName", e.target.value)}
                                   placeholder="e.g. Club Paradox" style={fieldStyle(false)}
                                   onFocus={e => e.target.style.borderColor = "#6c63ff"}
                                   onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px", marginBottom: "20px" }}>
                            <div>
                                <Label>Ticket Price (€)</Label>
                                <input type="number" min="0" step="0.01" value={form.ticketPrice}
                                       onChange={e => set("ticketPrice", e.target.value)}
                                       placeholder="0 = Free" style={fieldStyle(false)}
                                       onFocus={e => e.target.style.borderColor = "#6c63ff"}
                                       onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
                            </div>
                            <div>
                                <Label>Ticket URL</Label>
                                <input value={form.ticketUrl} onChange={e => set("ticketUrl", e.target.value)}
                                       placeholder="https://tickets.example.com" style={fieldStyle(false)}
                                       onFocus={e => e.target.style.borderColor = "#6c63ff"}
                                       onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
                            </div>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <Label>Image URL</Label>
                            <input value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)}
                                   placeholder="https://..." style={fieldStyle(false)}
                                   onFocus={e => e.target.style.borderColor = "#6c63ff"}
                                   onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <Label>Description</Label>
                            <textarea value={form.description} onChange={e => set("description", e.target.value)}
                                      placeholder="Tell people what to expect..."
                                      rows={3}
                                      style={{ ...fieldStyle(false), resize: "vertical", fontFamily: "sans-serif" }}
                                      onFocus={e => e.target.style.borderColor = "#6c63ff"}
                                      onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
                        </div>

                        <div style={{ marginBottom: "28px" }}>
                            <Label>Categories</Label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                {CATEGORIES.map(cat => {
                                    const selected = form.categories.includes(cat);
                                    return (
                                        <button key={cat} onClick={() => toggleCategory(cat)} style={{
                                            padding: "6px 14px", borderRadius: "20px",
                                            border: selected ? "1px solid #6c63ff" : "1px solid #2a2a2a",
                                            background: selected ? "rgba(108,99,255,0.15)" : "transparent",
                                            color: selected ? "#6c63ff" : "#9ca3af",
                                            fontSize: "12px", fontWeight: "500",
                                            cursor: "pointer", transition: "all 0.15s"
                                        }}>
                                            {cat}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {submitError && (
                            <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "16px", textAlign: "center" }}>
                                {submitError}
                            </p>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            style={{
                                width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                                background: submitting ? "#3a3a3a" : "linear-gradient(135deg, #6c63ff, #5a52e0)",
                                color: submitting ? "#9ca3af" : "white",
                                fontSize: "15px", fontWeight: "600",
                                cursor: submitting ? "not-allowed" : "pointer"
                            }}
                        >
                            {submitting ? "Creating..." : "Create Event"}
                        </button>
                    </div>
                </div>
            )}

            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "120px 32px 80px" }}>

                <div style={{
                    marginBottom: "48px", display: "flex",
                    justifyContent: "space-between", alignItems: "flex-start",
                    flexWrap: "wrap", gap: "16px"
                }}>
                    <div>
                        <h1 style={{ fontSize: "36px", fontWeight: "700", margin: "0 0 12px" }}>Discover Events</h1>
                        <p style={{ color: "#9ca3af", margin: 0 }}>Find the best events happening in Eindhoven</p>
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
                        <span style={{ fontSize: "18px", lineHeight: 1 }}>+</span> Add Event
                    </button>
                </div>

                <div style={{ marginBottom: "40px" }}>
                    <input placeholder="Search events..." style={{
                        width: "100%", padding: "14px 18px", borderRadius: "12px",
                        border: "1px solid #222", background: "#1a1a1a",
                        color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box"
                    }} />
                </div>

                {loading && (
                    <p style={{ color: "#9ca3af", textAlign: "center", marginTop: "60px" }}>Loading events...</p>
                )}

                {!loading && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
                        gap: "32px"
                    }}>
                        {events.length === 0 && (
                            <p style={{ color: "#9ca3af", gridColumn: "1/-1", textAlign: "center", marginTop: "40px" }}>
                                No events yet. Add the first one!
                            </p>
                        )}
                        {events.map(event => (
                            <Link key={event.id} to={`/events/${event.id}`} style={{
                                textDecoration: "none", color: "white", background: "#181818",
                                borderRadius: "16px", overflow: "hidden", border: "1px solid #222",
                                transition: "transform 0.25s ease, box-shadow 0.25s ease"
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
                                        src={event.imageUrl || `https://picsum.photos/500/300?${event.id}`}
                                        alt={event.name}
                                        style={{ width: "100%", height: "180px", objectFit: "cover" }}
                                    />
                                    <div style={{
                                        position: "absolute", inset: 0,
                                        background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)"
                                    }} />
                                </div>
                                <div style={{ padding: "16px" }}>
                                    <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "10px" }}>
                                        {event.name}
                                    </h3>
                                    <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "6px" }}>
                                        📅 {formatDate(event.startDate)}{event.startTime ? ` · ${event.startTime}` : ""}
                                    </p>
                                    {event.venue && (
                                        <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "6px" }}>
                                            📍 {event.venue.name}
                                        </p>
                                    )}
                                    <p style={{ fontSize: "14px", fontWeight: "600", color: "#6c63ff", margin: 0 }}>
                                        {event.ticketPrice != null
                                            ? (parseFloat(event.ticketPrice) === 0 ? "Free" : `€${event.ticketPrice}`)
                                            : ""}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}