import { NavLink } from "react-router-dom";
import BrandMark from "../ui/BrandMark";

const studentLinks = [["/student-dashboard", "Dashboard"], ["/my-complaints", "My Complaints"], ["/create-complaint", "New Complaint"]];
const adminLinks = [["/admin-dashboard", "Dashboard"]];

function Sidebar({ role = "student", onLogout }) {
    const links = role === "admin" ? adminLinks : studentLinks;
    return (
        <aside className="app-sidebar" aria-label="Primary navigation">
            <NavLink className="sidebar-brand" to={role === "admin" ? "/admin-dashboard" : "/student-dashboard"}>
                <BrandMark inverse />
                <span className="sidebar-brand-copy"><strong>CCMS</strong><span>Campus Complaint Management</span></span>
            </NavLink>
            <nav className="sidebar-nav">
                {links.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>{label}</NavLink>)}
            </nav>
            {onLogout && <button className="sidebar-link sidebar-link--logout" onClick={onLogout}>Logout</button>}
        </aside>
    );
}

export default Sidebar;
