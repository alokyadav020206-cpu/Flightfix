import { Link } from "react-router-dom";

// One tile in the dashboard's summary strip. Use tone="warn" to flag items needing attention.
export default function Card({ value, label, tone, to }) {
  const className = `stat${tone ? ` stat-${tone}` : ""}`;
  const content = (
    <>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </>
  );
  return to ? (
    <Link to={to} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
