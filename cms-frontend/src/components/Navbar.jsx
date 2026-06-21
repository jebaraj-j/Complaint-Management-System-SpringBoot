import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-custom">
            <div className="container">
                <Link to="/student-dashboard" className="brand">
                    <span style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#39ff14',
                        boxShadow: '0 0 8px #39ff14, 0 0 16px rgba(57,255,20,0.6)',
                        marginRight: 10,
                        verticalAlign: 'middle',
                        animation: 'blink 2s ease-in-out infinite'
                    }} />
                    CMS Portal
                </Link>
            </div>
            <style>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            `}</style>
        </nav>
    );
}

export default Navbar;
