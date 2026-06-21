import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function AdminDashboard() {

    const [complaints, setComplaints] =
        useState([]);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {

        try {

            const response =
                await api.get("/complaints");

            setComplaints(response.data);

        } catch (error) {

            console.log(error);

            alert(
                "Failed To Load Complaints"
            );
        }
    };

    const updateStatus = async (
        complaintId,
        status
    ) => {

        try {

            await api.put(
                `/complaints/${complaintId}/status`,
                { status }
            );

            fetchComplaints();

        } catch (error) {

            console.log(error);

            alert(
                "Failed To Update Status"
            );
        }
    };

    return (
        <>
          <Navbar/>
          <div className="page-container">

            <h2 className="auth-card">
                Admin Dashboard
            </h2>

            <table className="table table-bordered">

                <thead>

                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Action</th>
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

                                <td>

                                    <button
                                        className="btn btn-warning me-2"
                                        onClick={() =>
                                            updateStatus(
                                                complaint.id,
                                                "IN_PROGRESS"
                                            )
                                        }
                                    >
                                        In Progress
                                    </button>

                                    <button
                                        className="btn-green"
                                        onClick={() =>
                                            updateStatus(
                                                complaint.id,
                                                "RESOLVED"
                                            )
                                        }
                                    >
                                        Resolve
                                    </button>

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

export default AdminDashboard;