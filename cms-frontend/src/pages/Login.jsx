import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {

        if (
            formData.email === "admin@cms.com" &&
            formData.password === "admin123"
        ) {

            alert("Admin Login Successful");
            navigate("/admin-dashboard");
            return;
        }

        try {

            const response = await api.post(
                "/students/login",
                formData
            );

            localStorage.setItem(
                "student",
                JSON.stringify(response.data)
            );

            alert("Student Login Successful");

            navigate("/student-dashboard");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Login Failed"
            );
        }
    };

    return (
        <>
            <Navbar />

            <div className="page-container">

                <div className="auth-card">

                    <h2 className="auth-title">
                        Student Login
                    </h2>

                    <div className="mb-3">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            placeholder="Enter Email"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            placeholder="Enter Password"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        className="btn-green"
                        onClick={handleSubmit}
                    >
                        Login
                    </button>

                    <div className="admin-info">
                        <p>
                            Admin Login
                        </p>

                        <small>
                            admin@cms.com
                        </small>

                        <br />

                        <small>
                            admin123
                        </small>
                    </div>

                </div>

            </div>
        </>
    );
}

export default Login;