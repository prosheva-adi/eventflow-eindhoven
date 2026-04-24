import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080/api";

export default function EventDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/events/${id}`)
            .then(r => {
                if (!r.ok) throw new Error("Event not found");
                return r.json();
            })
            .then(data => setEvent(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
        });
    };

    if (loading) return (
        <div style={{ minHeight: "100vh", background: "#0f0f0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#9ca3af" }}>Loading event...</p>
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
            {/* Hero Image */}
            <div style={{ position: "relative", height: "400px", overflow: "hidden" }}>
                <img
                    src={event.imageUrl || `https://picsum.photos/1200/400?${event.id}`}
                    alt={event.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, #0f0f0f 20%, transparent 100%)"
                }} />
                {/* Back button */}
                <button
                    onClick={() => navigate("/events")}
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

                {/* Categories */}
                {event.categories?.length > 0 && (
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                        {event.categories.map(cat => (
                            <span key={cat} style={{
                                padding: "4px 12px", borderRadius: "20px",
                                background: "rgba(108,99,255,0.15)", border: "1px solid #6c63ff",
                                color: "#6c63ff", fontSize: "12px", fontWeight: "500"
                            }}>
                                {cat}
                            </span>
                        ))}
                    </div>
                )}

                <h1 style={{ fontSize: "42px", fontWeight: "700", margin: "0 0 24px" }}>
                    {event.name}
                </h1>

                {/* Info Grid */}
                <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr",
                    gap: "16px", marginBottom: "32px"
                }}>
                    {[
                        { icon: "📅", label: "Date", value: formatDate(event.startDate) },
                        { icon: "🕐", label: "Time", value: event.startTime + (event.endTime ? ` – ${event.endTime}` : "") },
                        { icon: "📍", label: "Venue", value: event.venue?.name || "TBA" },
                        { icon: "🎟️", label: "Price", value: event.ticketPrice != null ? (parseFloat(event.ticketPrice) === 0 ? "Free" : `€${event.ticketPrice}`) : "TBA" },
                        event.organiserName && { icon: "👤", label: "Organiser", value: event.organiserName },
                    ].filter(Boolean).map(({ icon, label, value }) => (
                        <div key={label} style={{
                            background: "#1a1a1a", borderRadius: "12px",
                            border: "1px solid #2a2a2a", padding: "16px"
                        }}>
                            <p style={{ color: "#9ca3af", fontSize: "12px", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                {icon} {label}
                            </p>
                            <p style={{ margin: 0, fontWeight: "600", fontSize: "15px" }}>{value}</p>
                        </div>
                    ))}
                </div>

                {/* Description */}
                {event.description && (
                    <div style={{ marginBottom: "32px" }}>
                        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>About</h2>
                        <p style={{ color: "#d1d5db", lineHeight: "1.7", margin: 0 }}>
                            {event.description}
                        </p>
                    </div>
                )}
0
                {event.ticketUrl && (
                    <a
                    href={event.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                    display: "inline-block", padding: "14px 32px",
                    borderRadius: "12px", background: "linear-gradient(135deg, #6c63ff, #5a52e0)",
                    color: "white", fontWeight: "600", fontSize: "15px",
                    textDecoration: "none"
                }}
                    >
                    Get Tickets →
                    </a>
                    )}
            </div>
        </div>
    );
}