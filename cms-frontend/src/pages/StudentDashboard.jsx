import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import AppShell from "../components/layout/AppShell";
import PageHeader from "../components/layout/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";

/* ── inline SVG icons ─────────────────────────────────────── */
function Icon({ d, children, size = 20 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden="true">
            {d ? <path d={d} /> : children}
        </svg>
    );
}

const ICONS = {
    total:      <><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></>,
    submitted:  <><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></>,
    progress:   <><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></>,
    resolved:   <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    plus:       "M12 5v14M5 12h14",
    list:       <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    bot:        <><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 11V7"/><circle cx="12" cy="5" r="2"/><path d="M8 15h.01M16 15h.01"/></>,
    alert:      <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    empty:      <><path d="M3 7h18M3 12h18M3 17h18"/></>,
    refresh:    "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
    arrowRight: "M5 12h14M12 5l7 7-7 7",
};

/* ── stat card ────────────────────────────────────────────── */
function StatCard({ label, value, icon, variant }) {
    return (
        <div className={`stat-card stat-card--${variant}`} aria-label={`${label}: ${value}`}>
            <div className="stat-card-icon" aria-hidden="true">
                <Icon size={22}>{icon}</Icon>
            </div>
            <div className="stat-card-body">
                <span className="stat-card-value">{value}</span>
                <span className="stat-card-label">{label}</span>
            </div>
        </div>
    );
}

/* ── quick action card ────────────────────────────────────── */
function ActionCard({ to, icon, label, description, disabled }) {
    const inner = (
        <>
            <span className="action-card-icon" aria-hidden="true">
                <Icon size={22}>{icon}</Icon>
            </span>
            <span className="action-card-body">
                <strong>{label}</strong>
                <span>{description}</span>
            </span>
            <span className="action-card-arrow" aria-hidden="true">
                <Icon size={16} d={ICONS.arrowRight} />
            </span>
        </>
    );

    if (disabled) {
        return (
            <div className="action-card action-card--disabled" aria-disabled="true">
                {inner}
                <span className="action-card-soon">Coming soon</span>
            </div>
        );
    }

    return (
        <Link to={to} className="action-card">
            {inner}
        </Link>
    );
}

/* ── main component ───────────────────────────────────────── */
function StudentDashboard() {
    const navigate = useNavigate();
    const student = JSON.parse(localStorage.getItem("student"));

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    /* stats derived from real data only */
    const stats = {
        total:     complaints.length,
        submitted: complaints.filter(c => c.status === "SUBMITTED").length,
        progress:  complaints.filter(c => c.status === "IN_PROGRESS").length,
        resolved:  complaints.filter(c => c.status === "RESOLVED").length,
    };

    const recent = complaints.slice(0, 5);

    const topbar = (
        <div className="topbar-inner">
            <span className="topbar-greeting">
                Hello, <strong>{student?.name}</strong>
            </span>
            <button className="btn-topbar-logout" onClick={handleLogout}>
                Sign out
            </button>
        </div>
    );

    const headerAction = (
        <Link to="/create-complaint" className="btn btn-primary btn-header-action">
            <Icon size={16} d={ICONS.plus} />
            New Complaint
        </Link>
    );

    return (
        <AppShell role="student" onLogout={handleLogout} topbar={topbar}>
            <div className="dashboard-page">
                <PageHeader
                    title={`Welcome back, ${student?.name ?? "Student"}`}
                    description="Here is an overview of your campus complaints."
                    actions={headerAction}
                />

                {/* ── stat cards ── */}
                <section className="stat-grid" aria-label="Complaint statistics">
                    <StatCard label="Total"       value={stats.total}     icon={ICONS.total}     variant="total" />
                    <StatCard label="Submitted"   value={stats.submitted} icon={ICONS.submitted} variant="submitted" />
                    <StatCard label="In Progress" value={stats.progress}  icon={ICONS.progress}  variant="progress" />
                    <StatCard label="Resolved"    value={stats.resolved}  icon={ICONS.resolved}  variant="resolved" />
                </section>

                <div className="dashboard-lower">
                    {/* ── recent complaints ── */}
                    <section className="dash-card recent-complaints" aria-labelledby="recent-title">
                        <div className="dash-card-header">
                            <h2 id="recent-title">Recent Complaints</h2>
                            {complaints.length > 5 && (
                                <Link to="/my-complaints" className="dash-card-link">
                                    View all
                                    <Icon size={14} d={ICONS.arrowRight} />
                                </Link>
                            )}
                        </div>

                        {loading && (
                            <div className="dash-state dash-state--loading" aria-live="polite" aria-busy="true">
                                <span className="spinner" aria-hidden="true" />
                                <span>Loading complaints…</span>
                            </div>
                        )}

                        {!loading && error && (
                            <div className="dash-state dash-state--error" role="alert">
                                <Icon size={20}>{ICONS.alert}</Icon>
                                <span>{error}</span>
                                <button className="btn-retry" onClick={fetchComplaints}>
                                    <Icon size={14} d={ICONS.refresh} />
                                    Retry
                                </button>
                            </div>
                        )}

                        {!loading && !error && complaints.length === 0 && (
                            <div className="dash-state dash-state--empty">
                                <span className="empty-icon" aria-hidden="true">
                                    <Icon size={36}>{ICONS.empty}</Icon>
                                </span>
                                <p>No complaints submitted yet.</p>
                                <Link to="/create-complaint" className="btn btn-primary">
                                    Submit your first complaint
                                </Link>
                            </div>
                        )}

                        {!loading && !error && recent.length > 0 && (
                            <ul className="complaint-list" aria-label="Recent complaints">
                                {recent.map(c => (
                                    <li key={c.id} className="complaint-row">
                                        <span className="complaint-row-id">#{c.id}</span>
                                        <span className="complaint-row-title">{c.title}</span>
                                        <span className="complaint-row-category">{c.category}</span>
                                        <StatusBadge status={c.status} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* ── quick actions ── */}
                    <section className="dash-card quick-actions" aria-labelledby="actions-title">
                        <div className="dash-card-header">
                            <h2 id="actions-title">Quick Actions</h2>
                        </div>
                        <div className="action-list">
                            <ActionCard
                                to="/create-complaint"
                                icon={ICONS.plus}
                                label="New Complaint"
                                description="Report a new campus issue"
                            />
                            <ActionCard
                                to="/my-complaints"
                                icon={ICONS.list}
                                label="My Complaints"
                                description="View and track all your complaints"
                            />
                            <ActionCard
                                disabled
                                icon={ICONS.bot}
                                label="AI Assistant"
                                description="Get help from the CCMS assistant"
                            />
                        </div>
                    </section>
                </div>
            </div>
        </AppShell>
    );
}

export default StudentDashboard;
