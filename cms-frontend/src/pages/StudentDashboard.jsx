import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function StudentDashboard() {

    const navigate = useNavigate();

    const student =
        JSON.parse(
            localStorage.getItem("student")
        );

    const handleLogout = () => {

        localStorage.removeItem("student");

        navigate("/");
    };

    return (
        <>
        <Navbar/>
        <div className="page-container">

            <div className="auth-card">

                <h2>
                    Welcome {student?.name}
                </h2>

                <p>
                    {student?.email}
                </p>

                <hr />

                <button
                    className="btn btn-primary mb-3"
                    onClick={() =>
                        navigate("/create-complaint")
                    }
                >
                    Create Complaint
                </button>

                <button
                    className="btn btn-warning mb-3"
                    onClick={() =>
                        navigate("/my-complaints")
                    }
                >
                    My Complaints
                </button>

                <button
                    className="btn-green"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </div>
        </>
    );
}

export default StudentDashboard;