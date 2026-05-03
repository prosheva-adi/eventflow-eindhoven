import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080/api";

// Security: only allow safe URL schemes for ticket links
function sanitizeUrl(url) {
    if (!url) return null;
    try {
        const parsed = new URL(url);
        if (parsed.protocol === "https:" || parsed.protocol === "http:") return url;
    } catch {
        // invalid URL
    }
    return null;
}

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

    @keyframes fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }

    .event-detail * { box-sizing: border-box; margin: 0; padding: 0; }

    .event-detail {
        min-height: 100vh;
        background: #0d0d0d;
        color: #f0ede8;
        font-family: 'DM Sans', sans-serif;
    }

    /* ── Hero ── */
    .hero {
        position: relative;
        height: 480px;
        overflow: hidden;
    }
    .hero-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        animation: fadeIn 0.6s ease;
        filter: brightness(0.75);
    }
    .hero-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to top,
            #0d0d0d 0%,
            rgba(13,13,13,0.6) 50%,
            transparent 100%
        );
    }
    .back-btn {
        position: absolute;
        top: 28px;
        left: 28px;
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(13,13,13,0.55);
        border: 1px solid rgba(255,255,255,0.12);
        color: #f0ede8;
        padding: 9px 18px;
        border-radius: 100px;
        cursor: pointer;
        font-size: 13px;
        font-family: 'DM Sans', sans-serif;
        font-weight: 500;
        letter-spacing: 0.3px;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        transition: background 0.2s, border-color 0.2s;
    }
    .back-btn:hover {
        background: rgba(108,99,255,0.25);
        border-color: rgba(108,99,255,0.5);
    }

    /* ── Content ── */
    .content {
        max-width: 820px;
        margin: 0 auto;
        padding: 0 32px 100px;
        animation: fadeUp 0.5s ease 0.1s both;
    }

    /* Categories */
    .categories {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 20px;
    }
    .category-tag {
        padding: 5px 14px;
        border-radius: 100px;
        background: rgba(108,99,255,0.12);
        border: 1px solid rgba(108,99,255,0.4);
        color: #9d97ff;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.8px;
        text-transform: uppercase;
    }

    /* Title */
    .event-title {
        font-family: 'DM Serif Display', serif;
        font-size: clamp(32px, 5vw, 52px);
        font-weight: 400;
        line-height: 1.1;
        margin-bottom: 36px;
        color: #f5f2ed;
        letter-spacing: -0.5px;
    }

    /* Divider */
    .divider {
        height: 1px;
        background: linear-gradient(to right, #2a2a2a, transparent);
        margin-bottom: 32px;
    }

    /* Info grid */
    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 12px;
        margin-bottom: 40px;
    }
    .info-card {
        background: #161616;
        border: 1px solid #222;
        border-radius: 14px;
        padding: 18px 20px;
        transition: border-color 0.2s;
    }
    .info-card:hover { border-color: #333; }
    .info-label {
        color: #666;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .info-value {
        font-size: 15px;
        font-weight: 500;
        color: #e8e4de;
        line-height: 1.4;
    }

    /* Description */
    .about-section { margin-bottom: 48px; }
    .section-heading {
        font-family: 'DM Serif Display', serif;
        font-size: 22px;
        font-weight: 400;
        color: #f5f2ed;
        margin-bottom: 14px;
        letter-spacing: -0.2px;
    }
    .description-text {
        color: #9e9b96;
        line-height: 1.8;
        font-size: 15.5px;
        font-weight: 300;
    }

    /* CTA */
    .ticket-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 15px 36px;
        border-radius: 14px;
        background: linear-gradient(135deg, #6c63ff 0%, #8b84ff 100%);
        color: white;
        font-family: 'DM Sans', sans-serif;
        font-weight: 600;
        font-size: 15px;
        text-decoration: none;
        letter-spacing: 0.2px;
        transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
        box-shadow: 0 4px 24px rgba(108,99,255,0.35);
        position: relative;
        overflow: hidden;
    }
    .ticket-btn::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(255,255,255,0);
        transition: background 0.2s;
    }
    .ticket-btn:hover {
        opacity: 0.92;
        transform: translateY(-1px);
        box-shadow: 0 8px 32px rgba(108,99,255,0.45);
    }
    .ticket-btn:active { transform: translateY(0); }

    /* Loading / Error states */
    .state-screen {
        min-height: 100vh;
        background: #0d0d0d;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'DM Sans', sans-serif;
    }
    .state-text-muted  { color: #555; font-size: 15px; }
    .state-text-error  { color: #ef4444; font-size: 15px; }

    @media (max-width: 600px) {
        .hero { height: 320px; }
        .content { padding: 0 20px 80px; }
        .info-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 400px) {
        .info-grid { grid-template-columns: 1fr; }
    }
`;

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
        if (!dateStr) return "TBA";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
        });
    };

    const formatTime = (start, end) => {
        if (!start) return "TBA";
        return end ? `${start} – ${end}` : start;
    };

    if (loading) return (
        <>
            <style>{styles}</style>
            <div className="state-screen">
                <p className="state-text-muted">Loading event…</p>
            </div>
        </>
    );

    if (error) return (
        <>
            <style>{styles}</style>
            <div className="state-screen">
                <p className="state-text-error">{error}</p>
            </div>
        </>
    );

    const safeTicketUrl = sanitizeUrl(event.ticketUrl);

    const infoItems = [
        { icon: "📅", label: "Date",      value: formatDate(event.startDate) },
        { icon: "🕐", label: "Time",      value: formatTime(event.startTime, event.endTime) },
        { icon: "📍", label: "Venue",     value: event.venue?.name || "TBA" },
        { icon: "🎟️", label: "Price",     value: event.ticketPrice != null
                ? (parseFloat(event.ticketPrice) === 0 ? "Free" : `€${event.ticketPrice}`)
                : "TBA" },
        event.organiserName && { icon: "👤", label: "Organiser", value: event.organiserName },
    ].filter(Boolean);

    return (
        <>
            <style>{styles}</style>
            <div className="event-detail">
                {/* Hero */}
                <div className="hero">
                    <img
                        className="hero-img"
                        src={event.imageUrl || `https://picsum.photos/1200/480?${event.id}`}
                        alt={event.name}
                    />
                    <div className="hero-gradient" />
                    <button className="back-btn" onClick={() => navigate("/events")}>
                        ← Back
                    </button>
                </div>

                {/* Content */}
                <div className="content">
                    {event.categories?.length > 0 && (
                        <div className="categories">
                            {event.categories.map(cat => (
                                <span key={cat} className="category-tag">{cat}</span>
                            ))}
                        </div>
                    )}

                    <h1 className="event-title">{event.name}</h1>

                    <div className="divider" />

                    <div className="info-grid">
                        {infoItems.map(({ icon, label, value }) => (
                            <div key={label} className="info-card">
                                <p className="info-label"><span>{icon}</span>{label}</p>
                                <p className="info-value">{value}</p>
                            </div>
                        ))}
                    </div>

                    {event.description && (
                        <div className="about-section">
                            <h2 className="section-heading">About</h2>
                            <p className="description-text">{event.description}</p>
                        </div>
                    )}

                    {safeTicketUrl && (
                        <a
                            href={safeTicketUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="ticket-btn"
                        >
                            Get Tickets →
                        </a>
                    )}
                </div>
            </div>
        </>
    );
}