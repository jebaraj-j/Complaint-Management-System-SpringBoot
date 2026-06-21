import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        department: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {

    try {

        const response =
            await api.post(
                "/students/register",
                formData
            );

        alert("Registration Successful");

        setFormData({
            name: "",
            email: "",
            password: "",
            department: ""
        });

        navigate("/");

        console.log(response.data);

    } catch (error) {

        alert(
            error.response?.data?.message ||
            "Registration Failed"
        );

    }
};

    return (
        <>
        <Navbar/>
        <div className="page-container">

            <div className="auth-card">

                <h2 className="auth-title">
                    Student Registration
                </h2>

                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Enter Name"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter Email"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="Enter Password"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="department"
                    value={formData.department}
                    placeholder="Enter Department"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <button
                    className="btn-green" onClick={handleSubmit}>

                    Register
                </button>

            </div>

        </div>
        </>
    );
}

export default Register;