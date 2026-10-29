const tones = {
  Active: "green",
  Available: "green",
  Completed: "green",
  OK: "green",
  Maintenance: "amber",
  "In Progress": "amber",
  "Low stock": "red",
  Scheduled: "blue",
  Assigned: "blue",
};

export const toneOf = (status) => tones[status] || "grey";

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${toneOf(status)}`}>{status}</span>;
}
