import { useState } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import { useData } from "../context/DataContext";
import { formatDate } from "../utils";

const emptyForm = { registration: "", model: "", status: "Active" };

export default function Aircraft() {
  const { aircraft, setAircraft, workOrders, maintenance } = useData();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [viewingId, setViewingId] = useState(null);

  const viewing = aircraft.find((a) => a.id === viewingId);
  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setFormOpen(true);
  };

  const openEdit = (a) => {
    setEditingId(a.id);
    setForm({ registration: a.registration, model: a.model, status: a.status });
    setError("");
    setFormOpen(true);
  };

  const save = (e) => {
    e.preventDefault();
    const registration = form.registration.trim();
    const duplicate = aircraft.some(
      (a) => a.registration.toLowerCase() === registration.toLowerCase() && a.id !== editingId
    );
    if (duplicate) {
      setError(`${registration} is already in the fleet.`);
      return;
    }
    const data = { ...form, registration, model: form.model.trim() };
    if (editingId) {
      setAircraft((list) => list.map((a) => (a.id === editingId ? { ...a, ...data } : a)));
    } else {
      setAircraft((list) => [...list, { ...data, id: Date.now() }]);
    }
    setFormOpen(false);
  };

  const remove = (a) => {
    if (window.confirm(`Delete ${a.registration}? This cannot be undone.`)) {
      setAircraft((list) => list.filter((x) => x.id !== a.id));
    }
  };

  return (
    <>
      <div className="page-head">
        <h1>Aircraft</h1>
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          Add aircraft
        </button>
      </div>

      <section className="panel">
        <Table
          columns={[
            { key: "registration", label: "Registration" },
            { key: "model", label: "Model" },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          ]}
          rows={aircraft}
          empty="No aircraft yet. Add the first one."
          actions={(row) => (
            <>
              <button type="button" className="btn btn-small" onClick={() => setViewingId(row.id)}>View</button>
              <button type="button" className="btn btn-small" onClick={() => openEdit(row)}>Edit</button>
              <button type="button" className="btn btn-small btn-danger" onClick={() => remove(row)}>Delete</button>
            </>
          )}
        />
      </section>

      {formOpen && (
        <Modal title={editingId ? "Edit aircraft" : "Add aircraft"} onClose={() => setFormOpen(false)}>
          <form className="form-stack" onSubmit={save}>
            <label className="field">
              <span>Registration</span>
              <input value={form.registration} onChange={setField("registration")} placeholder="e.g. VT-ABC" required autoFocus />
            </label>
            <label className="field">
              <span>Model</span>
              <input value={form.model} onChange={setField("model")} placeholder="e.g. Airbus A320" required />
            </label>
            <label className="field">
              <span>Status</span>
              <select value={form.status} onChange={setField("status")}>
                <option>Active</option>
                <option>Maintenance</option>
              </select>
            </label>
            {error && <p className="error" role="alert">{error}</p>}
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setFormOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editingId ? "Save changes" : "Add aircraft"}</button>
            </div>
          </form>
        </Modal>
      )}

      {viewing && (
        <Modal title={viewing.registration} onClose={() => setViewingId(null)}>
          <dl className="details">
            <dt>Model</dt>
            <dd>{viewing.model}</dd>
            <dt>Status</dt>
            <dd><StatusBadge status={viewing.status} /></dd>
          </dl>

          <h3>Work orders</h3>
          {workOrders.filter((w) => w.aircraft === viewing.registration).length === 0 ? (
            <p className="muted">No work orders for this aircraft.</p>
          ) : (
            <ul className="plain-list">
              {workOrders
                .filter((w) => w.aircraft === viewing.registration)
                .map((w) => (
                  <li key={w.id}>
                    <span>{w.id} · {w.task}</span>
                    <StatusBadge status={w.status} />
                  </li>
                ))}
            </ul>
          )}

          <h3>Scheduled maintenance</h3>
          {maintenance.filter((m) => m.aircraft === viewing.registration).length === 0 ? (
            <p className="muted">Nothing scheduled.</p>
          ) : (
            <ul className="plain-list">
              {maintenance
                .filter((m) => m.aircraft === viewing.registration)
                .map((m) => (
                  <li key={m.id}>
                    <span>{m.task}</span>
                    <span className="muted">{formatDate(m.dueDate)}</span>
                  </li>
                ))}
            </ul>
          )}
        </Modal>
      )}
    </>
  );
}
