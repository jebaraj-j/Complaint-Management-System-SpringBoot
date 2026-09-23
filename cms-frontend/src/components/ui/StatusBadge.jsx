const statusLabels = { SUBMITTED: "Submitted", IN_PROGRESS: "In progress", RESOLVED: "Resolved" };

function StatusBadge({ status }) {
    const className = status === "RESOLVED" ? "badge bg-success" : status === "IN_PROGRESS" ? "badge bg-warning" : "badge bg-secondary";
    return <span className={className}>{statusLabels[status] || status}</span>;
}

export default StatusBadge;
