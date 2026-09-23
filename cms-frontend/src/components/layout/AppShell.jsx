import Sidebar from "./Sidebar";

function AppShell({ children, role = "student", onLogout, topbar }) {
    return <div className="app-shell"><Sidebar role={role} onLogout={onLogout} /><div className="app-main">{topbar && <header className="app-topbar">{topbar}</header>}<main className="app-content">{children}</main></div></div>;
}

export default AppShell;
