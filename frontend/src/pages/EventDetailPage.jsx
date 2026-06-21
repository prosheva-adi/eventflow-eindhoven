import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";

function sanitizeUrl(url) {
    if (!url) return null;
    try {
        const parsed = new URL(url);
        if (parsed.protocol === "https:" || parsed.protocol === "http:") return url;
    } catch { /* empty */ }
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
    @keyframes heartPop {
        0%   { transform: scale(1); }
        30%  { transform: scale(1.4); }
        60%  { transform: scale(0.85); }
        100% { transform: scale(1); }
    }
    @keyframes heartUnpop {
        0%   { transform: scale(1); }
        50%  { transform: scale(0.8); }
        100% { transform: scale(1); }
    }

    .event-detail * { box-sizing: border-box; margin: 0; padding: 0; }
    .event-detail { min-height: 100vh; background: #0d0d0d; color: #f0ede8; font-family: 'DM Sans', sans-serif; }

    .hero { position: relative; height: 480px; overflow: hidden; }
    .hero-img { width: 100%; height: 100%; object-fit: cover; display: block; animation: fadeIn 0.6s ease; filter: brightness(0.75); }
    .hero-gradient { position: absolute; inset: 0; background: linear-gradient(to top, #0d0d0d 0%, rgba(13,13,13,0.6) 50%, transparent 100%); }

    .back-btn {
        position: absolute; top: 28px; left: 28px;
        display: flex; align-items: center; gap: 6px;
        background: rgba(13,13,13,0.55); border: 1px solid rgba(255,255,255,0.12);
        color: #f0ede8; padding: 9px 18px; border-radius: 100px; cursor: pointer;
        font-size: 13px; font-family: 'DM Sans', sans-serif; font-weight: 500; letter-spacing: 0.3px;
        backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        transition: background 0.2s, border-color 0.2s;
    }
    .back-btn:hover { background: rgba(108,99,255,0.25); border-color: rgba(108,99,255,0.5); }

    .content { max-width: 820px; margin: 0 auto; padding: 0 32px 100px; animation: fadeUp 0.5s ease 0.1s both; }

    .categories { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
    .category-tag {
        padding: 5px 14px; border-radius: 100px;
        background: rgba(108,99,255,0.12); border: 1px solid rgba(108,99,255,0.4);
        color: #9d97ff; font-size: 11px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase;
    }

    /* ── Title row with like button ── */
    .title-row {
        display: flex; align-items: flex-start; justify-content: space-between;
        gap: 20px; margin-bottom: 36px;
    }
    .event-title {
        font-family: 'DM Serif Display', serif;
        font-size: clamp(32px, 5vw, 52px); font-weight: 400; line-height: 1.1;
        color: #f5f2ed; letter-spacing: -0.5px; flex: 1;
    }

    /* ── Like button ── */
    .like-btn {
        display: flex; align-items: center; gap: 7px; flex-shrink: 0;
        margin-top: 6px;
        padding: 10px 20px; border-radius: 100px; cursor: pointer;
        font-size: 13px; font-family: 'DM Sans', sans-serif; font-weight: 600; letter-spacing: 0.3px;
        transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
        border: 1px solid #2a2a2a;
        background: #161616;
        color: #555;
    }
    .like-btn:hover:not(.like-btn--loading) {
        background: rgba(224,92,122,0.1);
        border-color: rgba(224,92,122,0.4);
        color: #e05c7a;
        transform: translateY(-1px);
    }
    .like-btn--liked {
        background: rgba(224,92,122,0.12);
        border-color: rgba(224,92,122,0.45);
        color: #e05c7a;
    }
    .like-btn--liked:hover:not(.like-btn--loading) {
        background: rgba(224,92,122,0.06);
        border-color: rgba(224,92,122,0.2);
        color: #a04458;
        transform: translateY(-1px);
    }
    .like-btn--loading { cursor: not-allowed; opacity: 0.5; }
    .like-btn-icon { font-size: 16px; line-height: 1; display: inline-block; }
    .like-btn-icon--pop   { animation: heartPop   0.35s ease; }
    .like-btn-icon--unpop { animation: heartUnpop 0.25s ease; }

    .divider { height: 1px; background: linear-gradient(to right, #2a2a2a, transparent); margin-bottom: 32px; }

    .info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-bottom: 40px; }
    .info-card { background: #161616; border: 1px solid #222; border-radius: 14px; padding: 18px 20px; transition: border-color 0.2s; }
    .info-card:hover { border-color: #333; }
    .info-label { color: #666; font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
    .info-value { font-size: 15px; font-weight: 500; color: #e8e4de; line-height: 1.4; }

    .about-section { margin-bottom: 48px; }
    .section-heading { font-family: 'DM Serif Display', serif; font-size: 22px; font-weight: 400; color: #f5f2ed; margin-bottom: 14px; letter-spacing: -0.2px; }
    .description-text { color: #9e9b96; line-height: 1.8; font-size: 15.5px; font-weight: 300; }

    .ticket-btn {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 15px 36px; border-radius: 14px;
        background: linear-gradient(135deg, #6c63ff 0%, #8b84ff 100%);
        color: white; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px;
        text-decoration: none; letter-spacing: 0.2px;
        transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
        box-shadow: 0 4px 24px rgba(108,99,255,0.35);
    }
    .ticket-btn:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 32px rgba(108,99,255,0.45); }
    .ticket-btn:active { transform: translateY(0); }

    .admin-actions { display: flex; gap: 12px; margin-top: 40px; padding-top: 32px; border-top: 1px solid #1e1e1e; }
    .edit-btn {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 11px 24px; border-radius: 10px;
        border: 1px solid #333; background: transparent;
        color: #aaa; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
        cursor: pointer; transition: border-color 0.2s, color 0.2s, background 0.2s;
    }
    .edit-btn:hover { border-color: #555; color: #f0ede8; background: rgba(255,255,255,0.04); }
    .delete-btn {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 11px 24px; border-radius: 10px;
        border: 1px solid rgba(239,68,68,0.3); background: transparent;
        color: #ef4444; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
        cursor: pointer; transition: border-color 0.2s, background 0.2s;
    }
    .delete-btn:hover { border-color: #ef4444; background: rgba(239,68,68,0.08); }

    .state-screen { min-height: 100vh; background: #0d0d0d; display: flex; align-items: center; justify-content: center; font-family: 'DM Sans', sans-serif; }
    .state-text-muted { color: #555; font-size: 15px; }
    .state-text-error { color: #ef4444; font-size: 15px; }

    @media (max-width: 600px) {
        .hero { height: 320px; }
        .content { padding: 0 20px 80px; }
        .info-grid { grid-template-columns: 1fr 1fr; }
        .admin-actions { flex-direction: column; }
        .like-btn span:last-child { display: none; }
    }
    @media (max-width: 400px) {
        .info-grid { grid-template-columns: 1fr; }
    }
`;

export default function EventDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin, isLoggedIn } = useAuth();

    const [event, setEvent]         = useState(null);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [deleting, setDeleting]   = useState(false);

    const [liked, setLiked]             = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [iconAnim, setIconAnim]       = useState("");


    useEffect(() => {
        api.get(`/api/events/${id}`)
            .then(res => setEvent(res.data))
            .catch(() => setError("Event not found"))
            .finally(() => setLoading(false));
    }, [id]);

   useEffect(() => {
        if (!isLoggedIn || !event) return;
        api.get(`/api/events/${id}/like`)
            .then(res => setLiked(res.data.liked))
            .catch(() => {});
    }, [id, event, isLoggedIn]);

    const handleLikeToggle = async () => {
        if (likeLoading) return;
        setLikeLoading(true);
        const wasLiked = liked;
        setLiked(!wasLiked);
        setIconAnim(wasLiked ? "unpop" : "pop");
        setTimeout(() => setIconAnim(""), 400);
        try {
            if (wasLiked) {
                await api.delete(`/api/events/${id}/like`);
            } else {
                await api.post(`/api/events/${id}/like`);
            }
        } catch (err) {
            console.error("Like toggle failed:", err);
            setLiked(wasLiked);
        } finally {
            setLikeLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this event? This cannot be undone.")) return;
        setDeleting(true);
        try {
            await api.delete(`/api/events/${id}`);
            navigate("/events");
        } catch (err) {
            console.error(err);
            alert("Failed to delete event. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "TBA";
        return new Date(dateStr).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    };

    const formatTime = (start, end) => {
        if (!start) return "TBA";
        return end ? `${start} – ${end}` : start;
    };

    if (loading) return (
        <>
            <style>{styles}</style>
            <div className="state-screen"><p className="state-text-muted">Loading event…</p></div>
        </>
    );

    if (error) return (
        <>
            <style>{styles}</style>
            <div className="state-screen"><p className="state-text-error">{error}</p></div>
        </>
    );

    const safeTicketUrl = sanitizeUrl(event.ticketUrl);

    const infoItems = [
        { icon: "📅", label: "Date",  value: formatDate(event.startDate) },
        { icon: "🕐", label: "Time",  value: formatTime(event.startTime, event.endTime) },
        { icon: "📍", label: "Venue", value: event.venue?.name || "TBA", venueId: event.venue?.id },
        { icon: "🎟️", label: "Price", value: event.ticketPrice != null ? (parseFloat(event.ticketPrice) === 0 ? "Free" : `€${event.ticketPrice}`) : "TBA" },
        event.organiserName && { icon: "👤", label: "Organiser", value: event.organiserName },
    ].filter(Boolean);

    return (
        <>
            <style>{styles}</style>
            <div className="event-detail">
                <div className="hero">
                    <img className="hero-img" src={event.imageUrl || `https://picsum.photos/1200/480?${event.id}`} alt={event.name} />
                    <div className="hero-gradient" />
                    <button className="back-btn" onClick={() => navigate("/events")}>← Back</button>
                </div>

                <div className="content">
                    {event.categories?.length > 0 && (
                        <div className="categories">
                            {event.categories.map(cat => <span key={cat} className="category-tag">{cat}</span>)}
                        </div>
                    )}

                    {}
                    <div className="title-row">
                        <h1 className="event-title">{event.name}</h1>
                        {isLoggedIn && (
                            <button
                                className={`like-btn${liked ? " like-btn--liked" : ""}${likeLoading ? " like-btn--loading" : ""}`}
                                onClick={handleLikeToggle}
                                title={liked ? "Remove from saved" : "Save event"}
                            >
                                <span className={`like-btn-icon${iconAnim === "pop" ? " like-btn-icon--pop" : iconAnim === "unpop" ? " like-btn-icon--unpop" : ""}`}>
                                    {liked ? "♥" : "♡"}
                                </span>
                                <span>{liked ? "Saved" : "Save"}</span>
                            </button>
                        )}
                    </div>

                    <div className="divider" />

                    <div className="info-grid">
                        {infoItems.map(({ icon, label, value, venueId }) => (
                            <div key={label} className="info-card">
                                <p className="info-label"><span>{icon}</span>{label}</p>
                                {venueId ? (
                                    <p
                                        className="info-value"
                                        style={{ color: "#9d97ff", cursor: "pointer" }}
                                        onClick={() => navigate(`/venues/${venueId}`)}
                                    >
                                        {value}
                                    </p>
                                ) : (
                                    <p className="info-value">{value}</p>
                                )}
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
                        <a href={safeTicketUrl} target="_blank" rel="noreferrer noopener" className="ticket-btn">
                            Get Tickets →
                        </a>
                    )}

                    {isAdmin && (
                        <div className="admin-actions">
                            <button className="edit-btn" onClick={() => navigate(`/events/${id}/edit`)}>
                                ✏️ Edit Event
                            </button>
                            <button className="delete-btn" onClick={handleDelete} disabled={deleting}>
                                {deleting ? "Deleting…" : "🗑 Delete Event"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}