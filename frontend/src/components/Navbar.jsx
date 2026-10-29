import { useNavigate } from "react-router-dom";
import { currentUser, logout } from "../auth";

export default function Navbar() {
  const navigate = useNavigate();
  const user = currentUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = typeof user === "string" ? user : user?.username || user?.email || "User";
  const role = typeof user === "object" ? user?.role : null;

  return (
    <header className="topbar">
      <span className="topbar-user">
        <strong>{displayName}</strong>
        {role && <span style={{ marginLeft: "0.5rem", fontSize: "0.85em", opacity: 0.8 }}>({role})</span>}
      </span>
      <button type="button" className="btn btn-ghost" onClick={handleLogout}>
        Log out
      </button>
    </header>
  );
}
