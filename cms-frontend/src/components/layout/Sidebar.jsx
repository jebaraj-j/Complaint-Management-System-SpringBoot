import { NavLink } from "react-router-dom";
import BrandMark from "../ui/BrandMark";

/* nav icon primitive */
function NavIcon({ children }) {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
            {children}
        </svg>
    );
}

const studentLinks = [
    ["/student-dashboard", "Dashboard",    <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>],
    ["/my-complaints",     "My Complaints",<><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></>],
    ["/create-complaint",  "New Complaint",<path d="M12 5v14M5 12h14"/>],
    ["/ai-assistant",      "AI Assistant", <><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 11V7"/><circle cx="12" cy="5" r="2"/><path d="M8 15h.01M16 15h.01"/></>],
];

const adminLinks = [
    ["/admin-dashboard", "Dashboard", <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>],
];

function Sidebar({ role = "student", onLogout }) {
    const links = role === "admin" ? adminLinks : studentLinks;
    return (
        <aside className="app-sidebar" aria-label="Primary navigation">
            <NavLink className="sidebar-brand" to={role === "admin" ? "/admin-dashboard" : "/student-dashboard"}>
                <BrandMark inverse />
                <span className="sidebar-brand-copy">
                    <strong>CCMS</strong>
                    <span>Campus Complaint Management</span>
                </span>
            </NavLink>
            <nav className="sidebar-nav">
                {links.map(([to, label, icon]) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
                    >
                        <NavIcon>{icon}</NavIcon>
                        {label}
                    </NavLink>
                ))}
            </nav>
            {onLogout && (
                <button className="sidebar-link sidebar-link--logout" onClick={onLogout}>
                    <NavIcon>
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </NavIcon>
                    Logout
                </button>
            )}
        </aside>
    );
}

export default Sidebar;
