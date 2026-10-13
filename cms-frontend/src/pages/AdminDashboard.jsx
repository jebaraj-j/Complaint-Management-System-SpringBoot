import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import AppShell from "../components/layout/AppShell";
import PageHeader from "../components/layout/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";

/* ── icon primitive ───────────────────────────────────────── */
function Icon({ d, children, size = 18 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden="true">
            {d ? <path d={d} /> : children}
        </svg>
    );
}

/* ── icon paths ───────────────────────────────────────────── */
const IC = {
    total:    <><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></>,
    submitted:<><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></>,
    progress: <><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></>,
    resolved: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    search:   "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
    refresh:  "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
    alert:    <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    tag:      <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
    check:    "M20 6L9 17l-5-5",
    arrowR:   "M5 12h14M12 5l7 7-7 7",
};

const FILTERS = [
    { label: "All",         value: "ALL" },
    { label: "Submitted",   value: "SUBMITTED" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Resolved",    value: "RESOLVED" },
];

const CATEGORY_COLOURS = {
    LAB:       "#4f46e5",
    CLASSROOM: "#0891b2",
    HOSTEL:    "#7c3aed",
    TRANSPORT: "#b45309",
    NETWORK:   "#0f766e",
    OTHER:     "#64748b",
};

function formatDate(str) {
    if (!str) return null;
    try { return new Date(str).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }); }
    catch { return null; }
}

/* ── stat card ────────────────────────────────────────────── */
function StatCard({ label, value, icon, variant }) {
    return (
        <div className={`stat-card stat-card--${variant}`} aria-label={`${label}: ${value}`}>
            <div className="stat-card-icon"><Icon size={22}>{icon}</Icon></div>
            <div className="stat-card-body">
                <span className="stat-card-value">{value}</span>
                <span className="stat-card-label">{label}</span>
            </div>
        </div>
    );
}

/* ── main component ───────────────────────────────────────── */
function AdminDashboard() {
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState("");
    const [search, setSearch]         = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [updating, setUpdating]     = useState(null); // complaintId being updated
    const [updateError, setUpdateError] = useState("");

    const handleLogout = () => navigate("/");

    /* ── fetch all complaints ── */
    const fetchComplaints = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/complaints");
            setComplaints(res.data);
        } catch {
            setError("Unable to load complaints. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

    /* ── update status — exact existing API contract ── */
    const updateStatus = async (complaintId, status) => {
        setUpdating(complaintId);
        setUpdateError("");
        try {
            await api.put(`/complaints/${complaintId}/status`, { status });
            // optimistic local update — avoids full refetch flicker
            setComplaints(prev =>
                prev.map(c => c.id === complaintId ? { ...c, status } : c)
            );
        } catch {
            setUpdateError(`Failed to update complaint #${complaintId}.`);
        } finally {
            setUpdating(null);
        }
    };

    /* ── derived stats from real data ── */
    const stats = {
        total:     complaints.length,
        submitted: complaints.filter(c => c.status === "SUBMITTED").length,
        progress:  complaints.filter(c => c.status === "IN_PROGRESS").length,
        resolved:  complaints.filter(c => c.status === "RESOLVED").length,
    };

    /* ── category breakdown from real data ── */
    const categoryMap = complaints.reduce((acc, c) => {
        acc[c.category] = (acc[c.category] || 0) + 1;
        return acc;
    }, {});
    const categories = Object.entries(categoryMap)
        .sort((a, b) => b[1] - a[1]);
    const maxCatCount = categories[0]?.[1] || 1;

    /* ── client-side filter + search ── */
    const visible = complaints.filter(c => {
        const matchFilter = activeFilter === "ALL" || c.status === activeFilter;
        const q = search.trim().toLowerCase();
        const matchSearch = !q ||
            String(c.id).includes(q) ||
            c.title?.toLowerCase().includes(q) ||
            c.category?.toLowerCase().includes(q);
        return matchFilter && matchSearch;
    });

    /* ── topbar ── */
    const topbar = (
        <div className="topbar-inner">
            <span className="topbar-greeting">
                <strong>Admin</strong>
                <span className="admin-badge-pill">Administrator</span>
            </span>
            <button className="btn-topbar-logout" onClick={handleLogout}>Sign out</button>
        </div>
    );

    return (
        <AppShell role="admin" onLogout={handleLogout} topbar={topbar}>
            <div className="admin-page">

                <PageHeader
                    title="Admin Dashboard"
                    description="Monitor and manage all campus complaints."
                    actions={
                        <button className="btn btn-primary btn-header-action" onClick={fetchComplaints}>
                            <Icon size={15} d={IC.refresh} />
                            Refresh
                        </button>
                    }
                />

                {/* ── stat cards ── */}
                <section className="stat-grid" aria-label="Complaint statistics">
                    <StatCard label="Total"       value={stats.total}     icon={IC.total}     variant="total" />
                    <StatCard label="Submitted"   value={stats.submitted} icon={IC.submitted} variant="submitted" />
                    <StatCard label="In Progress" value={stats.progress}  icon={IC.progress}  variant="progress" />
                    <StatCard label="Resolved"    value={stats.resolved}  icon={IC.resolved}  variant="resolved" />
                </section>

                <div className="admin-lower">

                    {/* ── complaint management ── */}
                    <section className="admin-main-col" aria-labelledby="complaints-title">

                        {/* toolbar */}
                        <div className="mc-toolbar">
                            <div className="mc-filters" role="group" aria-label="Filter by status">
                                {FILTERS.map(f => (
                                    <button
                                        key={f.value}
                                        className={`mc-filter-btn${activeFilter === f.value ? " mc-filter-btn--active" : ""}`}
                                        onClick={() => setActiveFilter(f.value)}
                                        aria-pressed={activeFilter === f.value}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                            <div className="mc-search-wrap">
                                <Icon size={15} d={IC.search} />
                                <input
                                    type="search"
                                    className="mc-search"
                                    placeholder="Search complaints…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    aria-label="Search complaints"
                                />
                            </div>
                        </div>

                        {updateError && (
                            <div className="admin-inline-error" role="alert">
                                <Icon size={15}>{IC.alert}</Icon>
                                {updateError}
                            </div>
                        )}

                        <div className="mc-card">

                            {loading && (
                                <div className="dash-state dash-state--loading" aria-live="polite" aria-busy="true">
                                    <span className="spinner" aria-hidden="true" />
                                    <span>Loading complaints…</span>
                                </div>
                            )}

                            {!loading && error && (
                                <div className="dash-state dash-state--error" role="alert">
                                    <Icon size={20}>{IC.alert}</Icon>
                                    <span>{error}</span>
                                    <button className="btn-retry" onClick={fetchComplaints}>
                                        <Icon size={14} d={IC.refresh} />
                                        Retry
                                    </button>
                                </div>
                            )}

                            {!loading && !error && complaints.length === 0 && (
                                <div className="dash-state dash-state--empty">
                                    <span className="empty-icon"><Icon size={40}>{IC.total}</Icon></span>
                                    <p>No complaints have been submitted yet.</p>
                                </div>
                            )}

                            {!loading && !error && complaints.length > 0 && visible.length === 0 && (
                                <div className="dash-state dash-state--empty">
                                    <span className="empty-icon"><Icon size={36} d={IC.search} /></span>
                                    <p>No complaints match your search or filter.</p>
                                    <button className="btn-retry" onClick={() => { setSearch(""); setActiveFilter("ALL"); }}>
                                        Clear filters
                                    </button>
                                </div>
                            )}

                            {!loading && !error && visible.length > 0 && (
                                <>
                                    {/* desktop table */}
                                    <table className="mc-table admin-table" aria-label="All complaints">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Title</th>
                                                <th>Category</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {visible.map(c => (
                                                <tr key={c.id} className="mc-row">
                                                    <td className="mc-cell-id">#{c.id}</td>
                                                    <td className="mc-cell-title">
                                                        <span className="mc-row-icon"><Icon size={14}>{IC.tag}</Icon></span>
                                                        {c.title}
                                                    </td>
                                                    <td className="mc-cell-category">{c.category}</td>
                                                    <td className="mc-cell-date">
                                                        {formatDate(c.createdAt) ?? <span className="mc-cell-na">—</span>}
                                                    </td>
                                                    <td className="mc-cell-status">
                                                        <StatusBadge status={c.status} />
                                                    </td>
                                                    <td className="admin-actions-cell">
                                                        {c.status !== "IN_PROGRESS" && c.status !== "RESOLVED" && (
                                                            <button
                                                                className="admin-action-btn admin-action-btn--progress"
                                                                onClick={() => updateStatus(c.id, "IN_PROGRESS")}
                                                                disabled={updating === c.id}
                                                                aria-label={`Mark complaint #${c.id} as In Progress`}
                                                            >
                                                                {updating === c.id ? <span className="spinner spinner--sm" /> : <Icon size={13} d={IC.refresh} />}
                                                                In Progress
                                                            </button>
                                                        )}
                                                        {c.status !== "RESOLVED" && (
                                                            <button
                                                                className="admin-action-btn admin-action-btn--resolve"
                                                                onClick={() => updateStatus(c.id, "RESOLVED")}
                                                                disabled={updating === c.id}
                                                                aria-label={`Mark complaint #${c.id} as Resolved`}
                                                            >
                                                                {updating === c.id ? <span className="spinner spinner--sm" /> : <Icon size={13} d={IC.check} />}
                                                                Resolve
                                                            </button>
                                                        )}
                                                        {c.status === "RESOLVED" && (
                                                            <span className="admin-resolved-label">
                                                                <Icon size={13} d={IC.check} />
                                                                Resolved
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* mobile cards */}
                                    <ul className="mc-mobile-list" aria-label="All complaints">
                                        {visible.map(c => (
                                            <li key={c.id} className="mc-mobile-card admin-mobile-card">
                                                <div className="mc-mobile-card-top">
                                                    <span className="mc-mobile-id">#{c.id}</span>
                                                    <StatusBadge status={c.status} />
                                                </div>
                                                <p className="mc-mobile-title">{c.title}</p>
                                                <div className="mc-mobile-meta">
                                                    <span>{c.category}</span>
                                                    {formatDate(c.createdAt) && <span>{formatDate(c.createdAt)}</span>}
                                                </div>
                                                <div className="admin-mobile-actions">
                                                    {c.status !== "IN_PROGRESS" && c.status !== "RESOLVED" && (
                                                        <button
                                                            className="admin-action-btn admin-action-btn--progress"
                                                            onClick={() => updateStatus(c.id, "IN_PROGRESS")}
                                                            disabled={updating === c.id}
                                                        >
                                                            In Progress
                                                        </button>
                                                    )}
                                                    {c.status !== "RESOLVED" && (
                                                        <button
                                                            className="admin-action-btn admin-action-btn--resolve"
                                                            onClick={() => updateStatus(c.id, "RESOLVED")}
                                                            disabled={updating === c.id}
                                                        >
                                                            Resolve
                                                        </button>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mc-footer">
                                        Showing {visible.length} of {complaints.length} complaint{complaints.length !== 1 ? "s" : ""}
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    {/* ── right sidebar panels ── */}
                    <aside className="admin-side-col">

                        {/* category breakdown */}
                        {categories.length > 0 && (
                            <div className="dash-card admin-side-card" aria-labelledby="cat-title">
                                <div className="dash-card-header">
                                    <h2 id="cat-title">By Category</h2>
                                </div>
                                <ul className="cat-list">
                                    {categories.map(([cat, count]) => (
                                        <li key={cat} className="cat-row">
                                            <span className="cat-label">{cat}</span>
                                            <div className="cat-bar-wrap" aria-label={`${count} complaints`}>
                                                <div
                                                    className="cat-bar"
                                                    style={{
                                                        width: `${Math.round((count / maxCatCount) * 100)}%`,
                                                        background: CATEGORY_COLOURS[cat] || "#64748b",
                                                    }}
                                                />
                                            </div>
                                            <span className="cat-count">{count}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* quick actions */}
                        <div className="dash-card admin-side-card" aria-labelledby="qa-title">
                            <div className="dash-card-header">
                                <h2 id="qa-title">Quick Actions</h2>
                            </div>
                            <div className="action-list">
                                <button
                                    className="action-card"
                                    onClick={fetchComplaints}
                                    style={{ border: "none", width: "100%", textAlign: "left", background: "none" }}
                                >
                                    <span className="action-card-icon"><Icon size={18} d={IC.refresh} /></span>
                                    <span className="action-card-body">
                                        <strong>Refresh Data</strong>
                                        <span>Reload all complaints</span>
                                    </span>
                                    <span className="action-card-arrow"><Icon size={14} d={IC.arrowR} /></span>
                                </button>
                                <div className="action-card action-card--disabled" aria-disabled="true">
                                    <span className="action-card-icon"><Icon size={18}>{IC.total}</Icon></span>
                                    <span className="action-card-body">
                                        <strong>Generate Report</strong>
                                        <span>Export complaint data</span>
                                    </span>
                                    <span className="action-card-soon">Coming soon</span>
                                </div>
                                <div className="action-card action-card--disabled" aria-disabled="true">
                                    <span className="action-card-icon"><Icon size={18}>{IC.submitted}</Icon></span>
                                    <span className="action-card-body">
                                        <strong>Manage Users</strong>
                                        <span>View student accounts</span>
                                    </span>
                                    <span className="action-card-soon">Coming soon</span>
                                </div>
                            </div>
                        </div>

                    </aside>
                </div>
            </div>
        </AppShell>
    );
}

export default AdminDashboard;
