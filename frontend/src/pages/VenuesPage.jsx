import { useState, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";

const VENUE_CATEGORIES = [
    "CLUB", "BAR", "CONCERT_HALL", "THEATRE", "OUTDOOR", "GALLERY", "STADIUM", "OTHER"
];

const EMPTY_FORM = {
    name: "", description: "", address: "",
    latitude: "", longitude: "", imageUrl: "", website: "", category: ""
};

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

    .vp * { box-sizing: border-box; margin: 0; padding: 0; }
    .vp { min-height: 100vh; background: #0d0d0d; color: #f0ede8; font-family: 'DM Sans', sans-serif; }

    .vp-header {
        max-width: 1400px; margin: 0 auto; padding: 72px 40px 0;
        display: flex; justify-content: space-between; align-items: flex-end;
        flex-wrap: wrap; gap: 24px; animation: fadeUp 0.5s ease both;
    }
    .vp-title {
        font-family: 'DM Serif Display', serif;
        font-size: clamp(36px, 5vw, 56px); font-weight: 400;
        letter-spacing: -1px; line-height: 1; color: #f5f2ed;
    }
    .vp-subtitle { color: #555; font-size: 15px; font-weight: 300; margin-top: 10px; letter-spacing: 0.2px; }

    .add-btn {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 13px 26px; border-radius: 100px; border: none;
        background: linear-gradient(135deg, #6c63ff 0%, #8b84ff 100%);
        color: white; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
        cursor: pointer; letter-spacing: 0.2px; white-space: nowrap;
        box-shadow: 0 4px 20px rgba(108,99,255,0.3);
        transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
    }
    .add-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(108,99,255,0.45); opacity: 0.92; }

    .vp-search-wrap { max-width: 1400px; margin: 36px auto 0; padding: 0 40px; animation: fadeUp 0.5s ease 0.05s both; }
    .vp-search {
        width: 100%; padding: 14px 20px 14px 44px; border-radius: 14px;
        border: 1px solid #1e1e1e; background: #111; color: #f0ede8;
        font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s;
    }
    .vp-search::placeholder { color: #444; }
    .vp-search:focus { border-color: rgba(108,99,255,0.5); }
    .vp-search-inner { position: relative; }
    .vp-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #444; font-size: 15px; pointer-events: none; }

    .vp-grid {
        max-width: 1400px; margin: 40px auto 0; padding: 0 40px 100px;
        display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
        gap: 24px; animation: fadeUp 0.5s ease 0.1s both;
    }

    .venue-card {
        display: block; text-decoration: none; color: #f0ede8; background: #141414;
        border-radius: 18px; overflow: hidden; border: 1px solid #1e1e1e;
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.2s;
    }
    .venue-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.5); border-color: #2a2a2a; }
    .venue-card-img-wrap { position: relative; height: 200px; overflow: hidden; }
    .venue-card-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; filter: brightness(0.85); }
    .venue-card:hover .venue-card-img { transform: scale(1.04); }
    .venue-card-img-gradient { position: absolute; inset: 0; background: linear-gradient(to top, rgba(20,20,20,0.8) 0%, transparent 60%); }
    .venue-card-cat-badge {
        position: absolute; top: 14px; right: 14px;
        background: rgba(108,99,255,0.2); border: 1px solid rgba(108,99,255,0.4);
        color: #9d97ff; padding: 5px 12px; border-radius: 100px;
        font-size: 10px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase;
    }
    .venue-card-body { padding: 20px 22px 22px; }
    .venue-card-name { font-family: 'DM Serif Display', serif; font-size: 21px; font-weight: 400; line-height: 1.2; margin-bottom: 12px; color: #f5f2ed; letter-spacing: -0.2px; }
    .venue-card-meta { display: flex; flex-direction: column; gap: 5px; }
    .venue-card-meta-row { display: flex; align-items: center; gap: 7px; font-size: 13px; color: #666; font-weight: 400; }
    .venue-card-desc {
        color: #444; font-size: 13px; font-weight: 300; margin-top: 10px; line-height: 1.5;
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }

    .vp-state { grid-column: 1 / -1; text-align: center; padding: 80px 0; color: #444; font-size: 15px; font-weight: 300; }

    /* Modal */
    .modal-backdrop {
        position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 1000;
        display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.2s ease;
    }
    .modal {
        background: #141414; border-radius: 22px; border: 1px solid #252525; padding: 36px;
        width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto;
        animation: modalIn 0.25s ease; scrollbar-width: thin; scrollbar-color: #2a2a2a transparent;
    }
    .modal::-webkit-scrollbar { width: 4px; }
    .modal::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .modal-title { font-family: 'DM Serif Display', serif; font-size: 26px; font-weight: 400; color: #f5f2ed; letter-spacing: -0.3px; }
    .modal-close {
        background: #1e1e1e; border: 1px solid #2a2a2a; color: #666;
        width: 34px; height: 34px; border-radius: 50%; cursor: pointer; font-size: 15px;
        display: flex; align-items: center; justify-content: center; transition: background 0.15s, color 0.15s; flex-shrink: 0;
    }
    .modal-close:hover { background: #2a2a2a; color: #f0ede8; }

    .field-group { margin-bottom: 20px; }
    .field-label { display: block; font-size: 10px; font-weight: 600; color: #555; margin-bottom: 7px; letter-spacing: 1px; text-transform: uppercase; }
    .field-input, .field-textarea, .field-select {
        width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #222;
        background: #0d0d0d; color: #f0ede8; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s;
        colorScheme: dark;
    }
    .field-input::placeholder, .field-textarea::placeholder { color: #333; }
    .field-input:focus, .field-textarea:focus, .field-select:focus { border-color: rgba(108,99,255,0.5); }
    .field-input.error { border-color: #ef4444; }
    .field-textarea { resize: vertical; min-height: 90px; }
    .field-select { color-scheme: dark; }
    .field-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .field-error { color: #ef4444; font-size: 11px; margin-top: 5px; display: block; }
    .modal-divider { height: 1px; background: linear-gradient(to right, #222, transparent); margin: 24px 0; }
    .submit-error { color: #ef4444; font-size: 13px; text-align: center; margin-bottom: 16px; }
    .submit-btn { width: 100%; padding: 15px; border-radius: 14px; border: none; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; transition: opacity 0.2s, transform 0.15s; letter-spacing: 0.2px; }
    .submit-btn.active { background: linear-gradient(135deg, #6c63ff 0%, #8b84ff 100%); color: white; box-shadow: 0 4px 20px rgba(108,99,255,0.3); }
    .submit-btn.active:hover { opacity: 0.9; transform: translateY(-1px); }
    .submit-btn.loading { background: #1e1e1e; color: #444; cursor: not-allowed; }

    @media (max-width: 640px) {
        .vp-header { padding: 56px 24px 0; }
        .vp-search-wrap { padding: 0 24px; }
        .vp-grid { padding: 0 24px 80px; grid-template-columns: 1fr; }
        .field-row-2 { grid-template-columns: 1fr; }
        .modal { padding: 24px 20px; }
    }
`;

function FieldError({ msg }) {
    if (!msg) return null;
    return <span className="field-error">{msg}</span>;
}

export default function VenuesPage() {
    const { isAdmin } = useAuth();
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const navigate = useNavigate();   // ← add this

    useEffect(() => {                  // ← add this block
        if (!isAdmin) navigate("/");
    }, [isAdmin]);

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
        try {
            const res = await api.post("/api/venues", {
                name: form.name, description: form.description || null,
                address: form.address, latitude: parseFloat(form.latitude),
                longitude: parseFloat(form.longitude), imageUrl: form.imageUrl || null,
                website: form.website || null, category: form.category
            });
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
        v.name?.toLowerCase().includes(search.toLowerCase()) ||
        v.address?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <style>{styles}</style>
            <div className="vp">

                {showModal && isAdmin && (
                    <div className="modal-backdrop" onClick={handleClose}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-title">Add Venue</h2>
                                <button className="modal-close" onClick={handleClose}>✕</button>
                            </div>

                            <div className="field-group">
                                <label className="field-label">Venue Name *</label>
                                <input className={`field-input${errors.name ? " error" : ""}`} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Effenaar" />
                                <FieldError msg={errors.name} />
                            </div>

                            <div className="field-group">
                                <label className="field-label">Category *</label>
                                <select className={`field-select${errors.category ? " error" : ""}`} value={form.category} onChange={e => set("category", e.target.value)} style={{ colorScheme: "dark" }}>
                                    <option value="">Select a category</option>
                                    {VENUE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.replace("_", " ")}</option>)}
                                </select>
                                <FieldError msg={errors.category} />
                            </div>

                            <div className="field-group">
                                <label className="field-label">Address *</label>
                                <input className={`field-input${errors.address ? " error" : ""}`} value={form.address} onChange={e => set("address", e.target.value)} placeholder="e.g. Dommelstraat 2, Eindhoven" />
                                <FieldError msg={errors.address} />
                            </div>

                            <div className="field-row-2">
                                <div>
                                    <label className="field-label">Latitude *</label>
                                    <input type="number" step="any" className={`field-input${errors.latitude ? " error" : ""}`} value={form.latitude} onChange={e => set("latitude", e.target.value)} placeholder="51.4381" />
                                    <FieldError msg={errors.latitude} />
                                </div>
                                <div>
                                    <label className="field-label">Longitude *</label>
                                    <input type="number" step="any" className={`field-input${errors.longitude ? " error" : ""}`} value={form.longitude} onChange={e => set("longitude", e.target.value)} placeholder="5.4752" />
                                    <FieldError msg={errors.longitude} />
                                </div>
                            </div>

                            <div className="field-group">
                                <label className="field-label">Website</label>
                                <input className="field-input" value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://venue.example.com" />
                            </div>

                            <div className="field-group">
                                <label className="field-label">Image URL</label>
                                <input className="field-input" value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} placeholder="https://example.com/image.jpg" />
                            </div>

                            <div className="field-group">
                                <label className="field-label">Description</label>
                                <textarea className="field-textarea" value={form.description} onChange={e => set("description", e.target.value)} placeholder="Tell people about this venue…" rows={3} />
                            </div>

                            <div className="modal-divider" />

                            {submitError && <p className="submit-error">{submitError}</p>}
                            <button className={`submit-btn ${submitting ? "loading" : "active"}`} onClick={handleSubmit} disabled={submitting}>
                                {submitting ? "Creating…" : "Create Venue"}
                            </button>
                        </div>
                    </div>
                )}

                <div className="vp-header">
                    <div>
                        <h1 className="vp-title">Venues</h1>
                        <p className="vp-subtitle">Every spot worth knowing in Eindhoven</p>
                    </div>
                    {isAdmin && (
                        <button className="add-btn" onClick={() => setShowModal(true)}>
                            <span style={{ fontSize: 20, fontWeight: 300 }}>+</span> Add Venue
                        </button>
                    )}
                </div>

                <div className="vp-search-wrap">
                    <div className="vp-search-inner">
                        <span className="vp-search-icon">⌕</span>
                        <input className="vp-search" placeholder="Search venues, addresses…" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="vp-grid">
                    {loading && <p className="vp-state">Loading venues…</p>}
                    {!loading && filtered.length === 0 && (
                        <p className="vp-state">{search ? `No venues matching "${search}"` : "No venues yet."}</p>
                    )}
                    {!loading && filtered.map(venue => (
                        <Link key={venue.id} to={`/venues/${venue.id}`} className="venue-card">
                            <div className="venue-card-img-wrap">
                                <img className="venue-card-img" src={venue.imageUrl || `https://picsum.photos/500/300?${venue.id}`} alt={venue.name} />
                                <div className="venue-card-img-gradient" />
                                {venue.category && (
                                    <span className="venue-card-cat-badge">{venue.category.replace("_", " ")}</span>
                                )}
                            </div>
                            <div className="venue-card-body">
                                <h3 className="venue-card-name">{venue.name}</h3>
                                <div className="venue-card-meta">
                                    <span className="venue-card-meta-row">
                                        <span>📍</span>{venue.address}
                                    </span>
                                    {venue.website && (
                                        <span className="venue-card-meta-row">
                                            <span>🌐</span>{venue.website.replace(/^https?:\/\//, "")}
                                        </span>
                                    )}
                                </div>
                                {venue.description && <p className="venue-card-desc">{venue.description}</p>}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}