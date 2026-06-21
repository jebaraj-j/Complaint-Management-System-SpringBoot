import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function MyComplaints() {

    const [complaints, setComplaints] =
        useState([]);

    const student =
        JSON.parse(
            localStorage.getItem("student")
        );

    useEffect(() => {

        fetchComplaints();

    }, []);

    const fetchComplaints = async () => {

        try {

            const response =
                await api.get(
                    `/complaints/student/${student.id}`
                );

            setComplaints(response.data);

        } catch (error) {

            console.log(error);

            alert(
                "Failed To Load Complaints"
            );
        }
    };

    return (
        <>
        <Navbar/>
        <div className="page-container">

            <h2 className="auth-title">
                My Complaints
            </h2>

            <table className="table table-bordered">

                <thead>

                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                </tr>

                </thead>

                <tbody>

                {
                    complaints.map(
                        (complaint) => (

                            <tr key={complaint.id}>

                                <td>
                                    {complaint.id}
                                </td>

                                <td>
                                    {complaint.title}
                                </td>

                                <td>
                                    {complaint.category}
                                </td>

                                <td>

    {
        complaint.status === "SUBMITTED" &&
        <span className="badge bg-secondary">
            SUBMITTED
        </span>
    }

    {
        complaint.status === "IN_PROGRESS" &&
        <span className="badge bg-warning text-dark">
            IN_PROGRESS
        </span>
    }

    {
        complaint.status === "RESOLVED" &&
        <span className="badge bg-success">
            RESOLVED
        </span>
    }

</td>

                            </tr>

                        )
                    )
                }

                </tbody>

            </table>

        </div>
        </>
    );
}

export default MyComplaints;