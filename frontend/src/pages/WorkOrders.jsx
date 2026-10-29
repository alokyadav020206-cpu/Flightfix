import { useState } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import { useData } from "../context/DataContext";
import { WORK_ORDER_STATUSES } from "../data";

const emptyForm = { aircraft: "", task: "", technician: "" };

export default function WorkOrders() {
  const { aircraft, technicians, workOrders, setWorkOrders } = useData();
  const [openId, setOpenId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const opened = workOrders.find((w) => w.id === openId);
  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const updateStatus = (id, status) =>
    setWorkOrders((list) => list.map((w) => (w.id === id ? { ...w, status } : w)));

  const nextId = () => {
    const highest = Math.max(100, ...workOrders.map((w) => parseInt(w.id.replace("WO-", ""), 10) || 0));
    return `WO-${highest + 1}`;
  };

  const create = (e) => {
    e.preventDefault();
    setWorkOrders((list) => [...list, { ...form, task: form.task.trim(), id: nextId(), status: "Scheduled" }]);
    setForm(emptyForm);
    setCreating(false);
  };

  return (
    <>
      <div className="page-head">
        <h1>Work orders</h1>
        <button type="button" className="btn btn-primary" onClick={() => setCreating(true)}>
          New work order
        </button>
      </div>

      <section className="panel">
        <Table
          columns={[
            { key: "id", label: "Work order" },
            { key: "aircraft", label: "Aircraft" },
            { key: "task", label: "Task" },
            { key: "technician", label: "Technician" },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          ]}
          rows={workOrders}
          empty="No work orders yet."
          actions={(row) => (
            <button type="button" className="btn btn-small" onClick={() => setOpenId(row.id)}>Open</button>
          )}
        />
      </section>

      {opened && (
        <Modal title={opened.id} onClose={() => setOpenId(null)}>
          <dl className="details">
            <dt>Aircraft</dt>
            <dd>{opened.aircraft}</dd>
            <dt>Task</dt>
            <dd>{opened.task}</dd>
            <dt>Technician</dt>
            <dd>{opened.technician || "Unassigned"}</dd>
          </dl>
          <label className="field">
            <span>Status</span>
            <select value={opened.status} onChange={(e) => updateStatus(opened.id, e.target.value)}>
              {WORK_ORDER_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <div className="modal-actions">
            <button type="button" className="btn btn-primary" onClick={() => setOpenId(null)}>Done</button>
          </div>
        </Modal>
      )}

      {creating && (
        <Modal title="New work order" onClose={() => setCreating(false)}>
          <form className="form-stack" onSubmit={create}>
            <label className="field">
              <span>Aircraft</span>
              <select value={form.aircraft} onChange={setField("aircraft")} required>
                <option value="" disabled>Select aircraft</option>
                {aircraft.map((a) => (
                  <option key={a.id} value={a.registration}>{a.registration}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Task</span>
              <input value={form.task} onChange={setField("task")} placeholder="e.g. Hydraulic leak check" required />
            </label>
            <label className="field">
              <span>Technician</span>
              <select value={form.technician} onChange={setField("technician")} required>
                <option value="" disabled>Select technician</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.name}>{t.name} ({t.specialty})</option>
                ))}
              </select>
            </label>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setCreating(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create work order</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
