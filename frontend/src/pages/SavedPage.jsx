import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    @keyframes heartPop {
        0%   { transform: scale(1); }
        40%  { transform: scale(1.35); }
        70%  { transform: scale(0.88); }
        100% { transform: scale(1); }
    }
    @keyframes shimmer {
        0%   { background-position: -400px 0; }
        100% { background-position: 400px 0; }
    }

    .sp * { box-sizing: border-box; margin: 0; padding: 0; }
    .sp { min-height: 100vh; background: #0d0d0d; color: #f0ede8; font-family: 'DM Sans', sans-serif; }

    /* ── Header ── */
    .sp-header {
        max-width: 1400px; margin: 0 auto; padding: 72px 40px 0;
        display: flex; justify-content: space-between; align-items: flex-end;
        flex-wrap: wrap; gap: 24px; animation: fadeUp 0.5s ease both;
    }
    .sp-title {
        font-family: 'DM Serif Display', serif;
        font-size: clamp(36px, 5vw, 56px); font-weight: 400;
        letter-spacing: -1px; line-height: 1; color: #f5f2ed;
    }
    .sp-subtitle { color: #555; font-size: 15px; font-weight: 300; margin-top: 10px; letter-spacing: 0.2px; }
    .sp-count-badge {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 8px 18px; border-radius: 100px;
        border: 1px solid #222; background: #111;
        font-size: 13px; font-weight: 500; color: #666;
        white-space: nowrap;
    }
    .sp-count-badge span { color: #9d97ff; font-weight: 600; }

    /* ── Search ── */
    .sp-search-wrap { max-width: 1400px; margin: 36px auto 0; padding: 0 40px; animation: fadeUp 0.5s ease 0.05s both; }
    .sp-search {
        width: 100%; padding: 14px 20px 14px 44px; border-radius: 14px;
        border: 1px solid #1e1e1e; background: #111; color: #f0ede8;
        font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s;
    }
    .sp-search::placeholder { color: #444; }
    .sp-search:focus { border-color: rgba(108,99,255,0.5); }
    .sp-search-wrap-inner { position: relative; }
    .sp-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #444; font-size: 15px; pointer-events: none; }

    /* ── Grid ── */
    .sp-grid {
        max-width: 1400px; margin: 40px auto 0; padding: 0 40px 100px;
        display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
        gap: 24px; animation: fadeUp 0.5s ease 0.1s both;
    }

    /* ── Card ── */
    .saved-card {
        display: block; text-decoration: none; color: #f0ede8; background: #141414;
        border-radius: 18px; overflow: hidden; border: 1px solid #1e1e1e;
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.2s;
        position: relative;
    }
    .saved-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.5); border-color: #2a2a2a; }
    .saved-card-img-wrap { position: relative; height: 200px; overflow: hidden; }
    .saved-card-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; filter: brightness(0.85); }
    .saved-card:hover .saved-card-img { transform: scale(1.04); }
    .saved-card-img-gradient { position: absolute; inset: 0; background: linear-gradient(to top, rgba(20,20,20,0.8) 0%, transparent 60%); }

    .saved-card-price-badge {
        position: absolute; top: 14px; right: 54px;
        background: rgba(13,13,13,0.7); border: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        color: #f0ede8; padding: 5px 12px; border-radius: 100px; font-size: 12px; font-weight: 600; letter-spacing: 0.3px;
    }
    .saved-card-price-badge.free { background: rgba(108,99,255,0.2); border-color: rgba(108,99,255,0.4); color: #9d97ff; }

    /* ── Unlike button ── */
    .unlike-btn {
        position: absolute; top: 12px; right: 12px; z-index: 2;
        width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.12);
        background: rgba(13,13,13,0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; font-size: 16px; line-height: 1;
        transition: background 0.2s, border-color 0.2s, transform 0.15s;
        color: #e05c7a;
    }
    .unlike-btn:hover { background: rgba(224,92,122,0.18); border-color: rgba(224,92,122,0.4); transform: scale(1.08); }
    .unlike-btn:active { animation: heartPop 0.35s ease; }
    .unlike-btn.removing { opacity: 0; transform: scale(0.7); transition: opacity 0.3s, transform 0.3s; pointer-events: none; }

    /* ── Liked-at badge ── */
    .liked-at-badge {
        position: absolute; bottom: 12px; left: 12px;
        background: rgba(13,13,13,0.65); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
        border: 1px solid rgba(255,255,255,0.07);
        color: #555; font-size: 10px; font-weight: 500; letter-spacing: 0.4px;
        padding: 4px 10px; border-radius: 100px;
    }

    .saved-card-body { padding: 20px 22px 22px; }
    .saved-card-categories { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
    .saved-card-cat { font-size: 10px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: #9d97ff; }
    .saved-card-cat + .saved-card-cat::before { content: '·'; margin-right: 6px; opacity: 0.5; }
    .saved-card-name { font-family: 'DM Serif Display', serif; font-size: 21px; font-weight: 400; line-height: 1.2; margin-bottom: 14px; color: #f5f2ed; letter-spacing: -0.2px; }
    .saved-card-meta { display: flex; flex-direction: column; gap: 5px; }
    .saved-card-meta-row { display: flex; align-items: center; gap: 7px; font-size: 13px; color: #666; font-weight: 400; }
    .saved-card-meta-icon { font-size: 12px; }

    /* ── Skeleton ── */
    .skeleton-card { background: #141414; border-radius: 18px; border: 1px solid #1e1e1e; overflow: hidden; }
    .skeleton-img { height: 200px; background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%); background-size: 800px 100%; animation: shimmer 1.4s infinite linear; }
    .skeleton-body { padding: 20px 22px 22px; display: flex; flex-direction: column; gap: 10px; }
    .skeleton-line { border-radius: 6px; background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%); background-size: 800px 100%; animation: shimmer 1.4s infinite linear; }

    /* ── States ── */
    .sp-state { grid-column: 1 / -1; text-align: center; padding: 80px 0; color: #444; font-size: 15px; font-weight: 300; }
    .sp-empty {
        grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center;
        justify-content: center; padding: 100px 24px; gap: 20px; animation: fadeIn 0.4s ease;
    }
    .sp-empty-icon { font-size: 48px; opacity: 0.2; }
    .sp-empty-title { font-family: 'DM Serif Display', serif; font-size: 28px; color: #333; font-weight: 400; }
    .sp-empty-sub { color: #444; font-size: 14px; font-weight: 300; max-width: 280px; text-align: center; line-height: 1.6; }
    .sp-empty-link {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 11px 22px; border-radius: 100px; border: 1px solid #252525;
        background: #141414; color: #9d97ff; font-family: 'DM Sans', sans-serif;
        font-size: 13px; font-weight: 600; text-decoration: none; letter-spacing: 0.2px;
        transition: background 0.15s, border-color 0.15s;
    }
    .sp-empty-link:hover { background: #1a1a1a; border-color: rgba(108,99,255,0.35); }

    /* ── Auth gate ── */
    .sp-auth-gate {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        min-height: 60vh; gap: 20px; padding: 40px; animation: fadeIn 0.4s ease;
    }
    .sp-auth-icon { font-size: 44px; opacity: 0.15; }
    .sp-auth-title { font-family: 'DM Serif Display', serif; font-size: 30px; color: #f5f2ed; font-weight: 400; }
    .sp-auth-sub { color: #555; font-size: 14px; font-weight: 300; }
    .sp-auth-link {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 13px 28px; border-radius: 100px; border: none;
        background: linear-gradient(135deg, #6c63ff 0%, #8b84ff 100%);
        color: white; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
        text-decoration: none; letter-spacing: 0.2px; box-shadow: 0 4px 20px rgba(108,99,255,0.3);
        transition: opacity 0.2s, transform 0.15s;
    }
    .sp-auth-link:hover { opacity: 0.9; transform: translateY(-2px); }

    @media (max-width: 640px) {
        .sp-header { padding: 56px 24px 0; }
        .sp-search-wrap { padding: 0 24px; }
        .sp-grid { padding: 0 24px 80px; grid-template-columns: 1fr; }
    }
`;

function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-img" />
            <div className="skeleton-body">
                <div className="skeleton-line" style={{ height: 12, width: "40%" }} />
                <div className="skeleton-line" style={{ height: 22, width: "75%" }} />
                <div className="skeleton-line" style={{ height: 14, width: "55%" }} />
                <div className="skeleton-line" style={{ height: 14, width: "40%" }} />
            </div>
        </div>
    );
}

export default function SavedPage() {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [removing, setRemoving] = useState(new Set());

    useEffect(() => {
        if (!isLoggedIn) { setLoading(false); return; }
        api.get("/api/events/liked")
            .then(res => setEvents(res.data))
            .catch(err => console.error("Failed to fetch liked events:", err))
            .finally(() => setLoading(false));
    }, [isLoggedIn]);

    const handleUnlike = async (e, eventId) => {
        e.preventDefault();
        e.stopPropagation();

        // Animate out first, then remove from state
        setRemoving(prev => new Set(prev).add(eventId));
        setTimeout(async () => {
            try {
                await api.delete(`/api/events/${eventId}/like`);
                setEvents(prev => prev.filter(ev => ev.eventId !== eventId));
            } catch (err) {
                console.error("Failed to unlike:", err);
                setRemoving(prev => { const s = new Set(prev); s.delete(eventId); return s; });
            }
        }, 300);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    };

    const formatLikedAt = (dt) => {
        if (!dt) return "";
        return new Date(dt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    };

    const formatPrice = (price) => {
        if (price == null) return null;
        return parseFloat(price) === 0 ? "Free" : `€${price}`;
    };

    const filtered = events.filter(e =>
        e.name?.toLowerCase().includes(search.toLowerCase()) ||
        e.organiserName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <style>{styles}</style>
            <div className="sp">

                {/* ── Auth gate ── */}
                {!isLoggedIn && (
                    <div className="sp-auth-gate">
                        <div className="sp-auth-icon">♡</div>
                        <h2 className="sp-auth-title">Your saved events</h2>
                        <p className="sp-auth-sub">Sign in to see the events you've liked</p>
                        <Link to="/login" className="sp-auth-link">Sign in</Link>
                    </div>
                )}

                {isLoggedIn && (
                    <>
                        {/* ── Header ── */}
                        <div className="sp-header">
                            <div>
                                <h1 className="sp-title">Saved Events</h1>
                                <p className="sp-subtitle">Events you've liked, all in one place</p>
                            </div>
                            {!loading && (
                                <div className="sp-count-badge">
                                    <span>{events.length}</span> saved
                                </div>
                            )}
                        </div>

                        {/* ── Search ── */}
                        {!loading && events.length > 0 && (
                            <div className="sp-search-wrap">
                                <div className="sp-search-wrap-inner">
                                    <span className="sp-search-icon">⌕</span>
                                    <input
                                        className="sp-search"
                                        placeholder="Search your saved events…"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* ── Grid ── */}
                        <div className="sp-grid">

                            {/* Skeletons while loading */}
                            {loading && [0,1,2].map(i => <SkeletonCard key={i} />)}

                            {/* Empty state */}
                            {!loading && events.length === 0 && (
                                <div className="sp-empty">
                                    <div className="sp-empty-icon">♡</div>
                                    <h2 className="sp-empty-title">Nothing saved yet</h2>
                                    <p className="sp-empty-sub">Like events you're interested in and they'll show up here</p>
                                    <Link to="/events" className="sp-empty-link">Browse events →</Link>
                                </div>
                            )}

                            {/* Search no results */}
                            {!loading && events.length > 0 && filtered.length === 0 && (
                                <p className="sp-state">No saved events matching "{search}"</p>
                            )}

                            {/* Cards */}
                            {!loading && filtered.map(event => {
                                const price = formatPrice(event.ticketPrice);
                                const isRemoving = removing.has(event.eventId);
                                return (
                                    <Link
                                        key={event.eventId}
                                        to={`/events/${event.eventId}`}
                                        className={`saved-card${isRemoving ? " removing" : ""}`}
                                        style={isRemoving ? { opacity: 0, transform: "scale(0.96)", transition: "opacity 0.3s, transform 0.3s" } : {}}
                                    >
                                        <div className="saved-card-img-wrap">
                                            <img
                                                className="saved-card-img"
                                                src={event.imageUrl || `https://picsum.photos/500/300?${event.eventId}`}
                                                alt={event.name}
                                            />
                                            <div className="saved-card-img-gradient" />

                                            {price && (
                                                <span className={`saved-card-price-badge${price === "Free" ? " free" : ""}`}>
                                                    {price}
                                                </span>
                                            )}

                                            {/* Unlike button */}
                                            <button
                                                className={`unlike-btn${isRemoving ? " removing" : ""}`}
                                                onClick={(e) => handleUnlike(e, event.eventId)}
                                                title="Remove from saved"
                                            >
                                                ♥
                                            </button>

                                            {/* Liked-at timestamp */}
                                            {event.likedAt && (
                                                <span className="liked-at-badge">
                                                    Saved {formatLikedAt(event.likedAt)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="saved-card-body">
                                            {event.categories?.length > 0 && (
                                                <div className="saved-card-categories">
                                                    {event.categories.map(c => (
                                                        <span key={c} className="saved-card-cat">{c}</span>
                                                    ))}
                                                </div>
                                            )}
                                            <h3 className="saved-card-name">{event.name}</h3>
                                            <div className="saved-card-meta">
                                                <span className="saved-card-meta-row">
                                                    <span className="saved-card-meta-icon">📅</span>
                                                    {formatDate(event.startDate)}{event.startTime ? ` · ${event.startTime}` : ""}
                                                </span>
                                                {event.organiserName && (
                                                    <span className="saved-card-meta-row">
                                                        <span className="saved-card-meta-icon">🎤</span>
                                                        {event.organiserName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}