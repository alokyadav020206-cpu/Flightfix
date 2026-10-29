import { NavLink } from "react-router-dom";

const links = [
  ["/dashboard", "Dashboard"],
  ["/aircraft", "Aircraft"],
  ["/maintenance", "Maintenance"],
  ["/work-orders", "Work orders"],
  ["/spare-parts", "Spare parts"],
  ["/technicians", "Technicians"],
  ["/legacy-dataset", "Dataset (50k)"],
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">FlightFix</div>
      <nav className="nav" aria-label="Main">
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : undefined)}>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
