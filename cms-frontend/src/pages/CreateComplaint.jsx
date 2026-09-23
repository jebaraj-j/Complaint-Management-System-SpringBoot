import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import AppShell from "../components/layout/AppShell";
import PageHeader from "../components/layout/PageHeader";

function Icon({ d, children, size = 18 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden="true">
            {d ? <path d={d} /> : children}
        </svg>
    );
}

const CATEGORIES = ["LAB", "CLASSROOM", "HOSTEL", "TRANSPORT", "NETWORK", "OTHER"];

const CATEGORY_ICONS = {
    LAB:        <><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></>,
    CLASSROOM:  <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>,
    HOSTEL:     <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    TRANSPORT:  <><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8zM5.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></>,
    NETWORK:    <><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></>,
    OTHER:      <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
};

function CreateComplaint() {
    const navigate = useNavigate();
    const student = JSON.parse(localStorage.getItem("student"));

    const [formData, setFormData] = useState({ title: "", description: "", category: "LAB" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("student");
        navigate("/");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        if (!formData.title.trim() || !formData.description.trim()) return;
        setError("");
        setIsSubmitting(true);
        try {
            await api.post("/complaints", { ...formData, studentId: student.id });
            setSuccess(true);
            setFormData({ title: "", description: "", category: "LAB" });
            setIsSubmitted(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit complaint. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const topbar = (
        <div className="topbar-inner">
            <span className="topbar-greeting">Hello, <strong>{student?.name}</strong></span>
            <button className="btn-topbar-logout" onClick={handleLogout}>Sign out</button>
        </div>
    );

    return (
        <AppShell role="student" onLogout={handleLogout} topbar={topbar}>
            <div className="cc-page">
                <PageHeader
                    title="Submit a New Complaint"
                    description="Help us improve the campus by reporting issues clearly and accurately."
                    actions={
                        <Link to="/my-complaints" className="btn-ghost-nav">
                            <Icon size={15} d="M19 12H5M12 5l-7 7 7 7" />
                            My Complaints
                        </Link>
                    }
                />

                <div className="cc-body">
                    <div className="cc-form-card">

                        {success && (
                            <div className="cc-success" role="status">
                                <Icon size={18}>
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                    <polyline points="22 4 12 14.01 9 11.01"/>
                                </Icon>
                                <div>
                                    <strong>Complaint submitted successfully.</strong>
                                    <span>
                                        <button className="cc-success-link" onClick={() => setSuccess(false)}>Submit another</button>
                                        {" or "}
                                        <Link to="/my-complaints" className="cc-success-link">view your complaints</Link>.
                                    </span>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="cc-alert" role="alert">
                                <Icon size={16}>
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="8" x2="12" y2="12"/>
                                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                                </Icon>
                                {error}
                            </div>
                        )}

                        {!success && (
                            <form className="cc-form" onSubmit={handleSubmit} noValidate>

                                {/* Title */}
                                <div className="cc-field">
                                    <label htmlFor="cc-title" className="cc-label">
                                        Complaint Title
                                        <span className="cc-required" aria-hidden="true">*</span>
                                    </label>
                                    <div className="cc-input-wrap">
                                        <Icon size={16} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <input
                                            id="cc-title"
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            placeholder="Briefly describe the issue"
                                            className={`form-control cc-input${isSubmitted && !formData.title.trim() ? " cc-input--invalid" : ""}`}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            aria-required="true"
                                            aria-invalid={isSubmitted && !formData.title.trim()}
                                            aria-describedby={isSubmitted && !formData.title.trim() ? "title-err" : undefined}
                                        />
                                    </div>
                                    {isSubmitted && !formData.title.trim() && (
                                        <span id="title-err" className="cc-field-error">Title is required.</span>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="cc-field">
                                    <label htmlFor="cc-category" className="cc-label">Category</label>
                                    <div className="cc-input-wrap cc-select-wrap">
                                        <span className="cc-select-icon" aria-hidden="true">
                                            <Icon size={16}>{CATEGORY_ICONS[formData.category]}</Icon>
                                        </span>
                                        <select
                                            id="cc-category"
                                            name="category"
                                            value={formData.category}
                                            className="form-control cc-input cc-select"
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        >
                                            {CATEGORIES.map(c => (
                                                <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
                                            ))}
                                        </select>
                                        <span className="cc-select-chevron" aria-hidden="true">
                                            <Icon size={14} d="M6 9l6 6 6-6" />
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="cc-field cc-field--full">
                                    <label htmlFor="cc-description" className="cc-label">
                                        Description
                                        <span className="cc-required" aria-hidden="true">*</span>
                                    </label>
                                    <textarea
                                        id="cc-description"
                                        name="description"
                                        value={formData.description}
                                        placeholder="Provide a detailed description of the issue, including when it occurred and how it affects you."
                                        className={`form-control cc-textarea${isSubmitted && !formData.description.trim() ? " cc-input--invalid" : ""}`}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        aria-required="true"
                                        aria-invalid={isSubmitted && !formData.description.trim()}
                                        aria-describedby={isSubmitted && !formData.description.trim() ? "desc-err" : undefined}
                                    />
                                    {isSubmitted && !formData.description.trim() && (
                                        <span id="desc-err" className="cc-field-error">Description is required.</span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="cc-actions">
                                    <Link to="/student-dashboard" className="btn-cc-cancel">
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn-cc-submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner spinner--sm" aria-hidden="true" />
                                                Submitting…
                                            </>
                                        ) : (
                                            <>
                                                <Icon size={16} d="M12 5v14M5 12h14" />
                                                Submit Complaint
                                            </>
                                        )}
                                    </button>
                                </div>

                            </form>
                        )}
                    </div>

                    {/* side info panel */}
                    <aside className="cc-info-panel" aria-label="Submission guidelines">
                        <h3>Before you submit</h3>
                        <ul className="cc-tips">
                            <li>
                                <Icon size={15} d="M9 12l2 2 4-4" />
                                Use a clear, specific title
                            </li>
                            <li>
                                <Icon size={15} d="M9 12l2 2 4-4" />
                                Select the most relevant category
                            </li>
                            <li>
                                <Icon size={15} d="M9 12l2 2 4-4" />
                                Describe the issue in detail
                            </li>
                            <li>
                                <Icon size={15} d="M9 12l2 2 4-4" />
                                Include when and where it occurred
                            </li>
                        </ul>
                        <div className="cc-info-divider" />
                        <p className="cc-info-note">
                            Your complaint will be reviewed by campus staff and you can track its progress from <Link to="/my-complaints">My Complaints</Link>.
                        </p>
                    </aside>
                </div>
            </div>
        </AppShell>
    );
}

export default CreateComplaint;
