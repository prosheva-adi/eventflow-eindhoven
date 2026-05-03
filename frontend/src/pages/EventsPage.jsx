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

// Security: only allow safe URL schemes
function sanitizeUrl(url) {
    if (!url) return null;
    try {
        const parsed = new URL(url);
        if (parsed.protocol === "https:" || parsed.protocol === "http:") return url;
    } catch { /* invalid */ }
    return null;
}

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
    @keyframes modalIn {
        from { opacity: 0; transform: scale(0.96) translateY(8px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    .ep * { box-sizing: border-box; margin: 0; padding: 0; }

    .ep {
        min-height: 100vh;
        background: #0d0d0d;
        color: #f0ede8;
        font-family: 'DM Sans', sans-serif;
    }

    /* ── Page header ── */
    .ep-header {
        max-width: 1400px;
        margin: 0 auto;
        padding: 72px 40px 0;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        flex-wrap: wrap;
        gap: 24px;
        animation: fadeUp 0.5s ease both;
    }
    .ep-title {
        font-family: 'DM Serif Display', serif;
        font-size: clamp(36px, 5vw, 56px);
        font-weight: 400;
        letter-spacing: -1px;
        line-height: 1;
        color: #f5f2ed;
    }
    .ep-subtitle {
        color: #555;
        font-size: 15px;
        font-weight: 300;
        margin-top: 10px;
        letter-spacing: 0.2px;
    }

    /* ── Add Event button ── */
    .add-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 13px 26px;
        border-radius: 100px;
        border: none;
        background: linear-gradient(135deg, #6c63ff 0%, #8b84ff 100%);
        color: white;
        font-family: 'DM Sans', sans-serif;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        letter-spacing: 0.2px;
        white-space: nowrap;
        box-shadow: 0 4px 20px rgba(108,99,255,0.3);
        transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
    }
    .add-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 28px rgba(108,99,255,0.45);
        opacity: 0.92;
    }
    .add-btn:active { transform: translateY(0); }
    .add-btn-icon {
        font-size: 20px;
        line-height: 1;
        font-weight: 300;
    }

    /* ── Search bar ── */
    .ep-search-wrap {
        max-width: 1400px;
        margin: 36px auto 0;
        padding: 0 40px;
        animation: fadeUp 0.5s ease 0.05s both;
    }
    .ep-search {
        width: 100%;
        padding: 14px 20px 14px 44px;
        border-radius: 14px;
        border: 1px solid #1e1e1e;
        background: #111;
        color: #f0ede8;
        font-family: 'DM Sans', sans-serif;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
    }
    .ep-search::placeholder { color: #444; }
    .ep-search:focus { border-color: rgba(108,99,255,0.5); }
    .ep-search-wrap-inner {
        position: relative;
    }
    .ep-search-icon {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        color: #444;
        font-size: 15px;
        pointer-events: none;
    }

    /* ── Grid ── */
    .ep-grid {
        max-width: 1400px;
        margin: 40px auto 0;
        padding: 0 40px 100px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
        gap: 24px;
        animation: fadeUp 0.5s ease 0.1s both;
    }

    /* ── Event card ── */
    .event-card {
        display: block;
        text-decoration: none;
        color: #f0ede8;
        background: #141414;
        border-radius: 18px;
        overflow: hidden;
        border: 1px solid #1e1e1e;
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.2s;
        position: relative;
    }
    .event-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 16px 40px rgba(0,0,0,0.5);
        border-color: #2a2a2a;
    }
    .event-card-img-wrap {
        position: relative;
        height: 200px;
        overflow: hidden;
    }
    .event-card-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.4s ease;
        filter: brightness(0.85);
    }
    .event-card:hover .event-card-img {
        transform: scale(1.04);
    }
    .event-card-img-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(20,20,20,0.8) 0%, transparent 60%);
    }
    .event-card-price-badge {
        position: absolute;
        top: 14px;
        right: 14px;
        background: rgba(13,13,13,0.7);
        border: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        color: #f0ede8;
        padding: 5px 12px;
        border-radius: 100px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.3px;
    }
    .event-card-price-badge.free {
        background: rgba(108,99,255,0.2);
        border-color: rgba(108,99,255,0.4);
        color: #9d97ff;
    }
    .event-card-body {
        padding: 20px 22px 22px;
    }
    .event-card-categories {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 10px;
    }
    .event-card-cat {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        color: #9d97ff;
    }
    .event-card-cat + .event-card-cat::before {
        content: '·';
        margin-right: 6px;
        opacity: 0.5;
    }
    .event-card-name {
        font-family: 'DM Serif Display', serif;
        font-size: 21px;
        font-weight: 400;
        line-height: 1.2;
        margin-bottom: 14px;
        color: #f5f2ed;
        letter-spacing: -0.2px;
    }
    .event-card-meta {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .event-card-meta-row {
        display: flex;
        align-items: center;
        gap: 7px;
        font-size: 13px;
        color: #666;
        font-weight: 400;
    }
    .event-card-meta-icon { font-size: 12px; }

    /* ── Empty / loading states ── */
    .ep-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 80px 0;
        color: #444;
        font-size: 15px;
        font-weight: 300;
    }

    /* ── Modal backdrop ── */
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.85);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        animation: fadeIn 0.2s ease;
    }

    /* ── Modal panel ── */
    .modal {
        background: #141414;
        border-radius: 22px;
        border: 1px solid #252525;
        padding: 36px;
        width: 100%;
        max-width: 580px;
        max-height: 90vh;
        overflow-y: auto;
        animation: modalIn 0.25s ease;
        scrollbar-width: thin;
        scrollbar-color: #2a2a2a transparent;
    }
    .modal::-webkit-scrollbar { width: 4px; }
    .modal::-webkit-scrollbar-track { background: transparent; }
    .modal::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
    }
    .modal-title {
        font-family: 'DM Serif Display', serif;
        font-size: 26px;
        font-weight: 400;
        color: #f5f2ed;
        letter-spacing: -0.3px;
    }
    .modal-close {
        background: #1e1e1e;
        border: 1px solid #2a2a2a;
        color: #666;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s, color 0.15s;
        flex-shrink: 0;
    }
    .modal-close:hover { background: #2a2a2a; color: #f0ede8; }

    /* ── Form fields ── */
    .field-group { margin-bottom: 20px; }
    .field-label {
        display: block;
        font-size: 10px;
        font-weight: 600;
        color: #555;
        margin-bottom: 7px;
        letter-spacing: 1px;
        text-transform: uppercase;
    }
    .field-input, .field-textarea {
        width: 100%;
        padding: 12px 16px;
        border-radius: 12px;
        border: 1px solid #222;
        background: #0d0d0d;
        color: #f0ede8;
        font-family: 'DM Sans', sans-serif;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
    }
    .field-input::placeholder, .field-textarea::placeholder { color: #333; }
    .field-input:focus, .field-textarea:focus { border-color: rgba(108,99,255,0.5); }
    .field-input.error, .field-textarea.error { border-color: #ef4444; }
    .field-textarea { resize: vertical; min-height: 90px; }
    .field-error {
        color: #ef4444;
        font-size: 11px;
        margin-top: 5px;
        display: block;
        letter-spacing: 0.2px;
    }

    .field-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .field-row-2 { display: grid; grid-template-columns: 1fr 2fr; gap: 12px; margin-bottom: 20px; }

    /* ── Category toggles ── */
    .cat-toggles { display: flex; flex-wrap: wrap; gap: 8px; }
    .cat-toggle {
        padding: 6px 15px;
        border-radius: 100px;
        font-family: 'DM Sans', sans-serif;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.6px;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.15s;
    }
    .cat-toggle.off {
        border: 1px solid #222;
        background: transparent;
        color: #555;
    }
    .cat-toggle.off:hover {
        border-color: #333;
        color: #888;
    }
    .cat-toggle.on {
        border: 1px solid rgba(108,99,255,0.5);
        background: rgba(108,99,255,0.12);
        color: #9d97ff;
    }

    /* ── Submit ── */
    .submit-error {
        color: #ef4444;
        font-size: 13px;
        text-align: center;
        margin-bottom: 16px;
    }
    .submit-btn {
        width: 100%;
        padding: 15px;
        border-radius: 14px;
        border: none;
        font-family: 'DM Sans', sans-serif;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s, transform 0.15s;
        letter-spacing: 0.2px;
    }
    .submit-btn.active {
        background: linear-gradient(135deg, #6c63ff 0%, #8b84ff 100%);
        color: white;
        box-shadow: 0 4px 20px rgba(108,99,255,0.3);
    }
    .submit-btn.active:hover { opacity: 0.9; transform: translateY(-1px); }
    .submit-btn.loading {
        background: #1e1e1e;
        color: #444;
        cursor: not-allowed;
    }

    /* ── Divider in modal ── */
    .modal-divider {
        height: 1px;
        background: linear-gradient(to right, #222, transparent);
        margin: 24px 0;
    }

    @media (max-width: 640px) {
        .ep-header { padding: 56px 24px 0; }
        .ep-search-wrap { padding: 0 24px; }
        .ep-grid { padding: 0 24px 80px; grid-template-columns: 1fr; }
        .field-row-3 { grid-template-columns: 1fr 1fr; }
        .field-row-2 { grid-template-columns: 1fr; }
        .modal { padding: 24px 20px; }
    }
`;

function FieldError({ msg }) {
    if (!msg) return null;
    return <span className="field-error">{msg}</span>;
}

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        api.get("/api/events")
            .then(res => setEvents(res.data))
            .catch(err => console.error("Failed to fetch events:", err))
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
        // Validate URLs if provided
        if (form.ticketUrl && !sanitizeUrl(form.ticketUrl)) e.ticketUrl = "Must be a valid https:// URL";
        if (form.imageUrl && !sanitizeUrl(form.imageUrl)) e.imageUrl = "Must be a valid https:// URL";
        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        setSubmitting(true);
        setSubmitError(null);
        const payload = {
            name: form.name.trim(),
            startDate: form.startDate,
            startTime: form.startTime,
            endTime: form.endTime || null,
            ticketPrice: form.ticketPrice ? parseFloat(form.ticketPrice) : null,
            ticketUrl: sanitizeUrl(form.ticketUrl),
            imageUrl: sanitizeUrl(form.imageUrl),
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
            setSubmitError(err.response?.data?.message || "Something went wrong. Please try again.");
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
        return new Date(dateStr).toLocaleDateString("en-GB", {
            weekday: "short", day: "numeric", month: "short"
        });
    };

    const formatPrice = (price) => {
        if (price == null) return null;
        return parseFloat(price) === 0 ? "Free" : `€${price}`;
    };

    const filteredEvents = events.filter(e =>
        e.name?.toLowerCase().includes(search.toLowerCase()) ||
        e.venue?.name?.toLowerCase().includes(search.toLowerCase()) ||
        e.organiserName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <style>{styles}</style>
            <div className="ep">

                {/* ── Modal ── */}
                {showModal && (
                    <div className="modal-backdrop" onClick={handleClose}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-title">Add Event</h2>
                                <button className="modal-close" onClick={handleClose} aria-label="Close">✕</button>
                            </div>

                            {/* Name */}
                            <div className="field-group">
                                <label className="field-label">Event Name *</label>
                                <input
                                    className={`field-input${errors.name ? " error" : ""}`}
                                    value={form.name}
                                    onChange={e => set("name", e.target.value)}
                                    placeholder="e.g. Techno Night at Effenaar"
                                />
                                <FieldError msg={errors.name} />
                            </div>

                            {/* Date / Time */}
                            <div className="field-row-3">
                                <div>
                                    <label className="field-label">Start Date *</label>
                                    <input type="date"
                                           className={`field-input${errors.startDate ? " error" : ""}`}
                                           value={form.startDate}
                                           onChange={e => set("startDate", e.target.value)}
                                           style={{ colorScheme: "dark" }}
                                    />
                                    <FieldError msg={errors.startDate} />
                                </div>
                                <div>
                                    <label className="field-label">Start Time *</label>
                                    <input type="time"
                                           className={`field-input${errors.startTime ? " error" : ""}`}
                                           value={form.startTime}
                                           onChange={e => set("startTime", e.target.value)}
                                           style={{ colorScheme: "dark" }}
                                    />
                                    <FieldError msg={errors.startTime} />
                                </div>
                                <div>
                                    <label className="field-label">End Time</label>
                                    <input type="time"
                                           className="field-input"
                                           value={form.endTime}
                                           onChange={e => set("endTime", e.target.value)}
                                           style={{ colorScheme: "dark" }}
                                    />
                                </div>
                            </div>

                            {/* Organiser */}
                            <div className="field-group">
                                <label className="field-label">Organiser</label>
                                <input className="field-input" value={form.organiserName}
                                       onChange={e => set("organiserName", e.target.value)}
                                       placeholder="e.g. Club Paradox" />
                            </div>

                            {/* Price / Ticket URL */}
                            <div className="field-row-2">
                                <div>
                                    <label className="field-label">Price (€)</label>
                                    <input type="number" min="0" step="0.01"
                                           className="field-input"
                                           value={form.ticketPrice}
                                           onChange={e => set("ticketPrice", e.target.value)}
                                           placeholder="0 = Free"
                                    />
                                </div>
                                <div>
                                    <label className="field-label">Ticket URL</label>
                                    <input className={`field-input${errors.ticketUrl ? " error" : ""}`}
                                           value={form.ticketUrl}
                                           onChange={e => set("ticketUrl", e.target.value)}
                                           placeholder="https://tickets.example.com"
                                    />
                                    <FieldError msg={errors.ticketUrl} />
                                </div>
                            </div>

                            {/* Image URL */}
                            <div className="field-group">
                                <label className="field-label">Image URL</label>
                                <input className={`field-input${errors.imageUrl ? " error" : ""}`}
                                       value={form.imageUrl}
                                       onChange={e => set("imageUrl", e.target.value)}
                                       placeholder="https://example.com/image.jpg"
                                />
                                <FieldError msg={errors.imageUrl} />
                            </div>

                            {/* Description */}
                            <div className="field-group">
                                <label className="field-label">Description</label>
                                <textarea className="field-textarea"
                                          value={form.description}
                                          onChange={e => set("description", e.target.value)}
                                          placeholder="Tell people what to expect…"
                                          rows={3}
                                />
                            </div>

                            <div className="modal-divider" />

                            {/* Categories */}
                            <div className="field-group">
                                <label className="field-label">Categories</label>
                                <div className="cat-toggles">
                                    {CATEGORIES.map(cat => {
                                        const on = form.categories.includes(cat);
                                        return (
                                            <button
                                                key={cat}
                                                className={`cat-toggle ${on ? "on" : "off"}`}
                                                onClick={() => toggleCategory(cat)}
                                            >
                                                {cat}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="modal-divider" />

                            {submitError && <p className="submit-error">{submitError}</p>}

                            <button
                                className={`submit-btn ${submitting ? "loading" : "active"}`}
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? "Creating…" : "Create Event"}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Page header ── */}
                <div className="ep-header">
                    <div>
                        <h1 className="ep-title">Discover Events</h1>
                        <p className="ep-subtitle">The best things happening in Eindhoven</p>
                    </div>
                    <button className="add-btn" onClick={() => setShowModal(true)}>
                        <span className="add-btn-icon">+</span> Add Event
                    </button>
                </div>

                {/* ── Search ── */}
                <div className="ep-search-wrap">
                    <div className="ep-search-wrap-inner">
                        <span className="ep-search-icon">⌕</span>
                        <input
                            className="ep-search"
                            placeholder="Search events, venues, organisers…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* ── Grid ── */}
                <div className="ep-grid">
                    {loading && <p className="ep-state">Loading events…</p>}

                    {!loading && filteredEvents.length === 0 && (
                        <p className="ep-state">
                            {search ? `No events matching "${search}"` : "No events yet. Add the first one!"}
                        </p>
                    )}

                    {!loading && filteredEvents.map(event => {
                        const price = formatPrice(event.ticketPrice);
                        return (
                            <Link key={event.id} to={`/events/${event.id}`} className="event-card">
                                <div className="event-card-img-wrap">
                                    <img
                                        className="event-card-img"
                                        src={event.imageUrl || `https://picsum.photos/500/300?${event.id}`}
                                        alt={event.name}
                                    />
                                    <div className="event-card-img-gradient" />
                                    {price && (
                                        <span className={`event-card-price-badge${price === "Free" ? " free" : ""}`}>
                                            {price}
                                        </span>
                                    )}
                                </div>
                                <div className="event-card-body">
                                    {event.categories?.length > 0 && (
                                        <div className="event-card-categories">
                                            {event.categories.map(c => (
                                                <span key={c} className="event-card-cat">{c}</span>
                                            ))}
                                        </div>
                                    )}
                                    <h3 className="event-card-name">{event.name}</h3>
                                    <div className="event-card-meta">
                                        <span className="event-card-meta-row">
                                            <span className="event-card-meta-icon">📅</span>
                                            {formatDate(event.startDate)}{event.startTime ? ` · ${event.startTime}` : ""}
                                        </span>
                                        {event.venue?.name && (
                                            <span className="event-card-meta-row">
                                                <span className="event-card-meta-icon">📍</span>
                                                {event.venue.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}