import { useState } from "react";
import Table from "../components/Table";
import { useData } from "../context/DataContext";
import { formatDate } from "../utils";

const emptyForm = { aircraft: "", task: "", dueDate: "" };

export default function Maintenance() {
  const { aircraft, maintenance, setMaintenance } = useData();
  const [form, setForm] = useState(emptyForm);
  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const schedule = (e) => {
    e.preventDefault();
    setMaintenance((list) => [...list, { ...form, task: form.task.trim(), id: Date.now() }]);
    setForm(emptyForm);
  };

  const complete = (id) => setMaintenance((list) => list.filter((m) => m.id !== id));

  const sorted = [...maintenance].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <>
      <div className="page-head">
        <h1>Maintenance schedule</h1>
      </div>

      <section className="panel">
        <h2>Schedule maintenance</h2>
        <form className="form-row" onSubmit={schedule}>
          <label className="field">
            <span>Aircraft</span>
            <select value={form.aircraft} onChange={setField("aircraft")} required>
              <option value="" disabled>Select aircraft</option>
              {aircraft.map((a) => (
                <option key={a.id} value={a.registration}>{a.registration}</option>
              ))}
            </select>
          </label>
          <label className="field field-grow">
            <span>Task</span>
            <input value={form.task} onChange={setField("task")} placeholder="e.g. Engine inspection" required />
          </label>
          <label className="field">
            <span>Due date</span>
            <input type="date" value={form.dueDate} onChange={setField("dueDate")} required />
          </label>
          <button type="submit" className="btn btn-primary">Schedule</button>
        </form>
      </section>

      <section className="panel">
        <Table
          columns={[
            { key: "aircraft", label: "Aircraft" },
            { key: "task", label: "Task" },
            { key: "dueDate", label: "Due date", render: (r) => formatDate(r.dueDate) },
          ]}
          rows={sorted}
          empty="No maintenance scheduled."
          actions={(row) => (
            <button type="button" className="btn btn-small" onClick={() => complete(row.id)}>Mark done</button>
          )}
        />
      </section>
    </>
  );
}
