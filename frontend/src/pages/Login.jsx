import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../auth";

export default function Login() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="runway" aria-hidden="true" />
        <div className="wordmark">FlightFix</div>
        <p>Maintenance schedules, work orders and spare parts for your fleet, in one place.</p>
      </section>
      <section className="login-side">
        <form className="login-form" onSubmit={handleLogin}>
          <h1>Sign in</h1>
          {error && (
            <div className="banner" style={{ background: "#fee2e2", color: "#b91c1c", marginBottom: "1rem", padding: "0.75rem", borderRadius: "6px" }} role="alert">
              {error}
            </div>
          )}
          <label className="field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin, manager, tech1"
              required
              autoFocus
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </label>
          <button type="submit" className="btn btn-primary btn-wide" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div style={{ marginTop: "1.5rem", borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
            <span style={{ fontSize: "0.85rem", color: "#6b7280", display: "block", marginBottom: "0.5rem" }}>
              Quick demo accounts:
            </span>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn btn-small"
                onClick={() => quickFill("admin", "admin123")}
              >
                Admin
              </button>
              <button
                type="button"
                className="btn btn-small"
                onClick={() => quickFill("manager", "manager123")}
              >
                Manager
              </button>
              <button
                type="button"
                className="btn btn-small"
                onClick={() => quickFill("tech1", "tech123")}
              >
                Tech 1
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
