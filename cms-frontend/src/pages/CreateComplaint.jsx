import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function CreateComplaint() {

    const student =
        JSON.parse(
            localStorage.getItem("student")
        );

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "LAB"
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {

        try {

            const complaintData = {
                ...formData,
                studentId: student.id
            };

            await api.post(
                "/complaints",
                complaintData
            );

            alert("Complaint Submitted");

            setFormData({
                title: "",
                description: "",
                category: "LAB"
            });

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed To Submit Complaint"
            );
        }
    };

    return (
       <>
       <Navbar/>
        <div className="page-container">

            <div className="auth-card">

                <h2 className="auth-title">Create Complaint</h2>

                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    placeholder="Complaint Title"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    value={formData.description}
                    placeholder="Complaint Description"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <select
                    name="category"
                    value={formData.category}
                    className="form-control mb-3"
                    onChange={handleChange}
                >
                    <option value="LAB">LAB</option>
                    <option value="CLASSROOM">CLASSROOM</option>
                    <option value="HOSTEL">HOSTEL</option>
                    <option value="TRANSPORT">TRANSPORT</option>
                    <option value="NETWORK">NETWORK</option>
                    <option value="OTHER">OTHER</option>
                </select>

                <button
                    className="btn-green"
                    onClick={handleSubmit}
                >
                    Submit Complaint
                </button>

            </div>

        </div>
       </>
    );
}

export default CreateComplaint;