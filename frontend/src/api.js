import { getToken, logout } from "./auth";

const BASE = "/api";

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${BASE}${cleanPath}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    logout();
    window.location.href = "/login";
    throw new Error("Session expired. Please sign in again.");
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const msg = errorBody
      ? Object.entries(errorBody)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join("; ")
      : `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: (path, options) => request(path, { method: "GET", ...options }),
  post: (path, body, options) =>
    request(path, { method: "POST", body: JSON.stringify(body), ...options }),
  put: (path, body, options) =>
    request(path, { method: "PUT", body: JSON.stringify(body), ...options }),
  patch: (path, body, options) =>
    request(path, { method: "PATCH", body: JSON.stringify(body), ...options }),
  del: (path, options) => request(path, { method: "DELETE", ...options }),
};
