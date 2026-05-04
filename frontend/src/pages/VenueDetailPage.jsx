import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";

const VENUE_CATEGORIES = [
    "CLUB", "BAR", "CONCERT_HALL", "THEATRE", "OUTDOOR", "GALLERY", "STADIUM", "OTHER"
];

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
    @keyframes modalIn {
        from { opacity: 0; transform: scale(0.96) translateY(8px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    .vd * { box-sizing: border-box; margin: 0; padding: 0; }
    .vd { min-height: 100vh; background: #0d0d0d; color: #f0ede8; font-family: 'DM Sans', sans-serif; }

    .vd-hero { position: relative; height: 420px; overflow: hidden; }
    .vd-hero-img { width: 100%; height: 100%; object-fit: cover; display: block; animation: fadeIn 0.6s ease; filter: brightness(0.75); }
    .vd-hero-gradient { position: absolute; inset: 0; background: linear-gradient(to top, #0d0d0d 0%, rgba(13,13,13,0.5) 50%, transparent 100%); }
    .vd-back-btn {
        position: absolute; top: 28px; left: 28px;
        display: flex; align-items: center; gap: 6px;
        background: rgba(13,13,13,0.55); border: 1px solid rgba(255,255,255,0.12);
        color: #f0ede8; padding: 9px 18px; border-radius: 100px; cursor: pointer;
        font-size: 13px; font-family: 'DM Sans', sans-serif; font-weight: 500; letter-spacing: 0.3px;
        backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        transition: background 0.2s, border-color 0.2s;
    }
    .vd-back-btn:hover { background: rgba(108,99,255,0.25); border-color: rgba(108,99,255,0.5); }

    .vd-content { max-width: 820px; margin: 0 auto; padding: 0 32px 100px; animation: fadeUp 0.5s ease 0.1s both; }

    .vd-cat-tag {
        display: inline-block; margin-bottom: 20px;
        padding: 5px 14px; border-radius: 100px;
        background: rgba(108,99,255,0.12); border: 1px solid rgba(108,99,255,0.4);
        color: #9d97ff; font-size: 11px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase;
    }

    .vd-title-row {
        display: flex; justify-content: space-between; align-items: flex-start;
        gap: 20px; margin-bottom: 36px; flex-wrap: wrap;
    }
    .vd-title {
        font-family: 'DM Serif Display', serif;
        font-size: clamp(32px, 5vw, 52px); font-weight: 400; line-height: 1.1;
        color: #f5f2ed; letter-spacing: -0.5px; flex: 1;
    }
    .vd-admin-btns { display: flex; gap: 10px; flex-shrink: 0; margin-top: 6px; }
    .vd-edit-btn {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 10px 20px; border-radius: 100px;
        border: 1px solid #2a2a2a; background: #161616;
        color: #888; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
        cursor: pointer; transition: border-color 0.2s, color 0.2s, background 0.2s;
    }
    .vd-edit-btn:hover { border-color: #444; color: #f0ede8; background: #1e1e1e; }
    .vd-delete-btn {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 10px 20px; border-radius: 100px;
        border: 1px solid rgba(239,68,68,0.25); background: transparent;
        color: #ef4444; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
        cursor: pointer; transition: border-color 0.2s, background 0.2s;
    }
    .vd-delete-btn:hover { border-color: #ef4444; background: rgba(239,68,68,0.08); }

    .vd-divider { height: 1px; background: linear-gradient(to right, #2a2a2a, transparent); margin-bottom: 32px; }

    .vd-info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-bottom: 40px; }
    .vd-info-card { background: #161616; border: 1px solid #222; border-radius: 14px; padding: 18px 20px; transition: border-color 0.2s; }
    .vd-info-card:hover { border-color: #333; }
    .vd-info-label { color: #666; font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
    .vd-info-value { font-size: 15px; font-weight: 500; color: #e8e4de; line-height: 1.4; }
    .vd-info-link { color: #9d97ff; font-size: 15px; font-weight: 500; text-decoration: none; }
    .vd-info-link:hover { text-decoration: underline; }

    .vd-about { margin-bottom: 48px; }
    .vd-section-heading { font-family: 'DM Serif Display', serif; font-size: 22px; font-weight: 400; color: #f5f2ed; margin-bottom: 14px; letter-spacing: -0.2px; }
    .vd-desc { color: #9e9b96; line-height: 1.8; font-size: 15.5px; font-weight: 300; }

    /* Edit form */
    .vd-edit-form { background: #141414; border: 1px solid #222; border-radius: 18px; padding: 28px; margin-bottom: 32px; }
    .vd-edit-heading { font-family: 'DM Serif Display', serif; font-size: 22px; font-weight: 400; color: #f5f2ed; margin-bottom: 24px; }
    .field-group { margin-bottom: 20px; }
    .field-label { display: block; font-size: 10px; font-weight: 600; color: #555; margin-bottom: 7px; letter-spacing: 1px; text-transform: uppercase; }
    .field-input, .field-textarea, .field-select {
        width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #222;
        background: #0d0d0d; color: #f0ede8; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s;
    }
    .field-input::placeholder, .field-textarea::placeholder { color: #333; }
    .field-input:focus, .field-textarea:focus, .field-select:focus { border-color: rgba(108,99,255,0.5); }
    .field-textarea { resize: vertical; min-height: 90px; }
    .field-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .save-error { color: #ef4444; font-size: 13px; margin-bottom: 16px; }
    .vd-form-actions { display: flex; gap: 12px; }
    .vd-cancel-btn {
        flex: 1; padding: 13px; border-radius: 12px; border: 1px solid #2a2a2a;
        background: transparent; color: #888; font-family: 'DM Sans', sans-serif;
        font-size: 14px; cursor: pointer; transition: border-color 0.2s, color 0.2s;
    }
    .vd-cancel-btn:hover { border-color: #444; color: #f0ede8; }
    .vd-save-btn {
        flex: 2; padding: 13px; border-radius: 12px; border: none;
        background: linear-gradient(135deg, #6c63ff 0%, #8b84ff 100%);
        color: white; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
        cursor: pointer; transition: opacity 0.2s; box-shadow: 0 4px 20px rgba(108,99,255,0.25);
    }
    .vd-save-btn:hover { opacity: 0.9; }
    .vd-save-btn:disabled { background: #1e1e1e; color: #444; cursor: not-allowed; box-shadow: none; }

    /* Delete modal */
    .modal-backdrop {
        position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 1000;
        display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.2s ease;
    }
    .del-modal {
        background: #141414; border-radius: 22px; border: 1px solid #2a1a1a;
        padding: 40px 36px; width: 100%; max-width: 400px; text-align: center;
        animation: modalIn 0.25s ease;
    }
    .del-modal-icon { font-size: 44px; margin-bottom: 16px; }
    .del-modal-title { font-family: 'DM Serif Display', serif; font-size: 26px; font-weight: 400; color: #f5f2ed; margin-bottom: 12px; }
    .del-modal-sub { color: #555; font-size: 14px; font-weight: 300; line-height: 1.6; margin-bottom: 28px; }
    .del-modal-sub strong { color: #f0ede8; font-weight: 500; }
    .del-modal-actions { display: flex; gap: 12px; }
    .del-cancel-btn {
        flex: 1; padding: 13px; border-radius: 12px; border: 1px solid #2a2a2a;
        background: transparent; color: #888; font-family: 'DM Sans', sans-serif;
        font-size: 14px; cursor: pointer; transition: border-color 0.2s, color 0.2s;
    }
    .del-cancel-btn:hover { border-color: #444; color: #f0ede8; }
    .del-confirm-btn {
        flex: 1; padding: 13px; border-radius: 12px; border: none;
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
        cursor: pointer; transition: opacity 0.2s;
    }
    .del-confirm-btn:hover { opacity: 0.9; }
    .del-confirm-btn:disabled { background: #1e1e1e; color: #444; cursor: not-allowed; }

    .state-screen { min-height: 100vh; background: #0d0d0d; display: flex; align-items: center; justify-content: center; font-family: 'DM Sans', sans-serif; }
    .state-muted { color: #555; font-size: 15px; }
    .state-error { color: #ef4444; font-size: 15px; }

    @media (max-width: 600px) {
        .vd-hero { height: 300px; }
        .vd-content { padding: 0 20px 80px; }
        .vd-info-grid { grid-template-columns: 1fr 1fr; }
        .field-row-2 { grid-template-columns: 1fr; }
        .vd-title-row { flex-direction: column; }
        .vd-admin-btns { width: 100%; }
    }
`;

export default function VenueDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    const [venue, setVenue]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState(null);

    const [editing, setEditing]   = useState(false);
    const [form, setForm]         = useState({});
    const [saving, setSaving]     = useState(false);
    const [saveError, setSaveError] = useState(null);

    const [showDelete, setShowDelete] = useState(false);
    const [deleting, setDeleting]     = useState(false);

    useEffect(() => {
        api.get(`/api/venues/${id}`)
            .then(res => { setVenue(res.data); setForm(res.data); })
            .catch(err => setError(err.response?.data?.message || "Venue not found"))
            .finally(() => setLoading(false));
    }, [id]);

    const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const handleSave = async () => {
        setSaving(true);
        setSaveError(null);
        try {
            const res = await api.put(`/api/venues/${id}`, {
                name: form.name, description: form.description || null,
                address: form.address, latitude: parseFloat(form.latitude),
                longitude: parseFloat(form.longitude), imageUrl: form.imageUrl || null,
                website: form.website || null, category: form.category
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
            setShowDelete(false);
        }
    };

    if (loading) return (
        <><style>{styles}</style>
            <div className="state-screen"><p className="state-muted">Loading venue…</p></div></>
    );
    if (error) return (
        <><style>{styles}</style>
            <div className="state-screen"><p className="state-error">{error}</p></div></>
    );

    const infoItems = [
        { icon: "📍", label: "Address",     value: venue.address },
        { icon: "🗺️", label: "Coordinates", value: `${venue.latitude}, ${venue.longitude}` },
        venue.website && { icon: "🌐", label: "Website", value: venue.website, isLink: true },
    ].filter(Boolean);

    return (
        <>
            <style>{styles}</style>
            <div className="vd">

                {/* Delete confirm modal */}
                {showDelete && (
                    <div className="modal-backdrop" onClick={() => setShowDelete(false)}>
                        <div className="del-modal" onClick={e => e.stopPropagation()}>
                            <div className="del-modal-icon">🗑️</div>
                            <h2 className="del-modal-title">Delete Venue?</h2>
                            <p className="del-modal-sub">
                                This will permanently delete <strong>{venue.name}</strong>. This cannot be undone.
                            </p>
                            <div className="del-modal-actions">
                                <button className="del-cancel-btn" onClick={() => setShowDelete(false)}>Cancel</button>
                                <button className="del-confirm-btn" onClick={handleDelete} disabled={deleting}>
                                    {deleting ? "Deleting…" : "Yes, Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="vd-hero">
                    <img className="vd-hero-img" src={venue.imageUrl || `https://picsum.photos/1200/420?${venue.id}`} alt={venue.name} />
                    <div className="vd-hero-gradient" />
                    <button className="vd-back-btn" onClick={() => navigate("/venues")}>← Back</button>
                </div>

                <div className="vd-content">
                    {venue.category && (
                        <span className="vd-cat-tag">{venue.category.replace("_", " ")}</span>
                    )}

                    <div className="vd-title-row">
                        <h1 className="vd-title">{venue.name}</h1>
                        {isAdmin && !editing && (
                            <div className="vd-admin-btns">
                                <button className="vd-edit-btn" onClick={() => setEditing(true)}>✏️ Edit</button>
                                <button className="vd-delete-btn" onClick={() => setShowDelete(true)}>🗑️ Delete</button>
                            </div>
                        )}
                    </div>

                    <div className="vd-divider" />

                    {!editing && (
                        <>
                            <div className="vd-info-grid">
                                {infoItems.map(({ icon, label, value, isLink }) => (
                                    <div key={label} className="vd-info-card">
                                        <p className="vd-info-label"><span>{icon}</span>{label}</p>
                                        {isLink
                                            ? <a href={value} target="_blank" rel="noreferrer" className="vd-info-link">{value.replace(/^https?:\/\//, "")}</a>
                                            : <p className="vd-info-value">{value}</p>
                                        }
                                    </div>
                                ))}
                            </div>

                            {venue.description && (
                                <div className="vd-about">
                                    <h2 className="vd-section-heading">About</h2>
                                    <p className="vd-desc">{venue.description}</p>
                                </div>
                            )}
                        </>
                    )}

                    {editing && (
                        <div className="vd-edit-form">
                            <h2 className="vd-edit-heading">Edit Venue</h2>

                            <div className="field-group">
                                <label className="field-label">Venue Name *</label>
                                <input className="field-input" value={form.name || ""} onChange={e => set("name", e.target.value)} />
                            </div>

                            <div className="field-group">
                                <label className="field-label">Category *</label>
                                <select className="field-select" value={form.category || ""} onChange={e => set("category", e.target.value)} style={{ colorScheme: "dark" }}>
                                    {VENUE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.replace("_", " ")}</option>)}
                                </select>
                            </div>

                            <div className="field-group">
                                <label className="field-label">Address *</label>
                                <input className="field-input" value={form.address || ""} onChange={e => set("address", e.target.value)} />
                            </div>

                            <div className="field-row-2">
                                <div>
                                    <label className="field-label">Latitude *</label>
                                    <input type="number" step="any" className="field-input" value={form.latitude || ""} onChange={e => set("latitude", e.target.value)} />
                                </div>
                                <div>
                                    <label className="field-label">Longitude *</label>
                                    <input type="number" step="any" className="field-input" value={form.longitude || ""} onChange={e => set("longitude", e.target.value)} />
                                </div>
                            </div>

                            <div className="field-group">
                                <label className="field-label">Website</label>
                                <input className="field-input" value={form.website || ""} onChange={e => set("website", e.target.value)} />
                            </div>

                            <div className="field-group">
                                <label className="field-label">Image URL</label>
                                <input className="field-input" value={form.imageUrl || ""} onChange={e => set("imageUrl", e.target.value)} />
                            </div>

                            <div className="field-group">
                                <label className="field-label">Description</label>
                                <textarea className="field-textarea" value={form.description || ""} onChange={e => set("description", e.target.value)} rows={4} />
                            </div>

                            {saveError && <p className="save-error">{saveError}</p>}

                            <div className="vd-form-actions">
                                <button className="vd-cancel-btn" onClick={() => { setForm(venue); setEditing(false); setSaveError(null); }}>Cancel</button>
                                <button className="vd-save-btn" onClick={handleSave} disabled={saving}>
                                    {saving ? "Saving…" : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}