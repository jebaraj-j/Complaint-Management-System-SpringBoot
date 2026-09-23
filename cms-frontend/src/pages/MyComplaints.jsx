import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import AppShell from "../components/layout/AppShell";
import PageHeader from "../components/layout/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";

function Icon({ d, children, size = 18 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden="true">
            {d ? <path d={d} /> : children}
        </svg>
    );
}

const FILTERS = [
    { label: "All",         value: "ALL" },
    { label: "Submitted",   value: "SUBMITTED" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Resolved",    value: "RESOLVED" },
];

const CATEGORY_ICON = (
    <><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></>
);

function formatDate(dateStr) {
    if (!dateStr) return null;
    try {
        return new Date(dateStr).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
    } catch {
        return null;
    }
}

function MyComplaints() {
    const navigate = useNavigate();
    const student = JSON.parse(localStorage.getItem("student"));

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");

    const handleLogout = () => {
        localStorage.removeItem("student");
        navigate("/");
    };

    const fetchComplaints = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get(`/complaints/student/${student.id}`);
            setComplaints(response.data);
        } catch {
            setError("Unable to load your complaints. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [student?.id]);

    useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

    /* client-side filter + search — no backend calls */
    const visible = complaints.filter(c => {
        const matchesFilter = activeFilter === "ALL" || c.status === activeFilter;
        const q = search.trim().toLowerCase();
        const matchesSearch = !q ||
            String(c.id).includes(q) ||
            c.title?.toLowerCase().includes(q) ||
            c.category?.toLowerCase().includes(q);
        return matchesFilter && matchesSearch;
    });

    const topbar = (
        <div className="topbar-inner">
            <span className="topbar-greeting">Hello, <strong>{student?.name}</strong></span>
            <button className="btn-topbar-logout" onClick={handleLogout}>Sign out</button>
        </div>
    );

    return (
        <AppShell role="student" onLogout={handleLogout} topbar={topbar}>
            <div className="mc-page">
                <PageHeader
                    title="My Complaints"
                    description="Track the status of your submitted complaints."
                    actions={
                        <Link to="/create-complaint" className="btn btn-primary btn-header-action">
                            <Icon size={15} d="M12 5v14M5 12h14" />
                            New Complaint
                        </Link>
                    }
                />

                {/* toolbar: search + filters */}
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
                        <Icon size={15} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
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

                {/* content card */}
                <div className="mc-card">

                    {loading && (
                        <div className="dash-state dash-state--loading" aria-live="polite" aria-busy="true">
                            <span className="spinner" aria-hidden="true" />
                            <span>Loading complaints…</span>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="dash-state dash-state--error" role="alert">
                            <Icon size={20}>
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </Icon>
                            <span>{error}</span>
                            <button className="btn-retry" onClick={fetchComplaints}>
                                <Icon size={14} d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                                Retry
                            </button>
                        </div>
                    )}

                    {!loading && !error && complaints.length === 0 && (
                        <div className="dash-state dash-state--empty">
                            <span className="empty-icon" aria-hidden="true">
                                <Icon size={40}>{CATEGORY_ICON}</Icon>
                            </span>
                            <p>No complaints submitted yet.</p>
                            <Link to="/create-complaint" className="btn btn-primary btn-header-action">
                                Submit your first complaint
                            </Link>
                        </div>
                    )}

                    {!loading && !error && complaints.length > 0 && visible.length === 0 && (
                        <div className="dash-state dash-state--empty">
                            <span className="empty-icon" aria-hidden="true">
                                <Icon size={36} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                            </span>
                            <p>No complaints match your search or filter.</p>
                            <button className="btn-retry" onClick={() => { setSearch(""); setActiveFilter("ALL"); }}>
                                Clear filters
                            </button>
                        </div>
                    )}

                    {!loading && !error && visible.length > 0 && (
                        <>
                            {/* desktop table */}
                            <table className="mc-table" aria-label="Complaints list">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visible.map(c => (
                                        <tr key={c.id} className="mc-row">
                                            <td className="mc-cell-id">#{c.id}</td>
                                            <td className="mc-cell-title">
                                                <span className="mc-row-icon" aria-hidden="true">
                                                    <Icon size={15}>{CATEGORY_ICON}</Icon>
                                                </span>
                                                {c.title}
                                            </td>
                                            <td className="mc-cell-category">{c.category}</td>
                                            <td className="mc-cell-date">
                                                {formatDate(c.createdAt) ?? <span className="mc-cell-na">—</span>}
                                            </td>
                                            <td className="mc-cell-status">
                                                <StatusBadge status={c.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* mobile cards */}
                            <ul className="mc-mobile-list" aria-label="Complaints list">
                                {visible.map(c => (
                                    <li key={c.id} className="mc-mobile-card">
                                        <div className="mc-mobile-card-top">
                                            <span className="mc-mobile-id">#{c.id}</span>
                                            <StatusBadge status={c.status} />
                                        </div>
                                        <p className="mc-mobile-title">{c.title}</p>
                                        <div className="mc-mobile-meta">
                                            <span>{c.category}</span>
                                            {formatDate(c.createdAt) && <span>{formatDate(c.createdAt)}</span>}
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
            </div>
        </AppShell>
    );
}

export default MyComplaints;
