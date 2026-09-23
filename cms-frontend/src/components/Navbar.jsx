import { Link } from "react-router-dom";
import BrandMark from "./ui/BrandMark";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-custom">
            <div className="container">
                <Link to="/student-dashboard" className="brand" aria-label="CCMS student dashboard">
                    <BrandMark />
                    <span style={{ marginLeft: 10 }}>CCMS</span>
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
