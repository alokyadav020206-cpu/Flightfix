import { useState } from "react";
import Table from "../components/Table";
import StatusBadge from "../components/StatusBadge";
import { useData } from "../context/DataContext";
import { LOW_STOCK_LIMIT } from "../data";

const emptyForm = { partNo: "", name: "", quantity: "" };

export default function SpareParts() {
  const { parts, setParts } = useData();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const lowCount = parts.filter((p) => p.quantity < LOW_STOCK_LIMIT).length;

  const add = (e) => {
    e.preventDefault();
    const partNo = form.partNo.trim();
    if (parts.some((p) => p.partNo.toLowerCase() === partNo.toLowerCase())) {
      setError(`${partNo} already exists. Use + to add stock instead.`);
      return;
    }
    setParts((list) => [...list, { partNo, name: form.name.trim(), quantity: Number(form.quantity) }]);
    setForm(emptyForm);
    setError("");
  };

  const adjust = (partNo, delta) =>
    setParts((list) =>
      list.map((p) => (p.partNo === partNo ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p))
    );

  return (
    <>
      <div className="page-head">
        <h1>Spare parts</h1>
      </div>

      {lowCount > 0 && (
        <div className="banner" role="status">
          {lowCount} {lowCount === 1 ? "part is" : "parts are"} below the minimum of {LOW_STOCK_LIMIT} units.
        </div>
      )}

      <section className="panel">
        <h2>Add a part</h2>
        <form className="form-row" onSubmit={add}>
          <label className="field">
            <span>Part no.</span>
            <input value={form.partNo} onChange={setField("partNo")} placeholder="e.g. P-105" required />
          </label>
          <label className="field field-grow">
            <span>Name</span>
            <input value={form.name} onChange={setField("name")} placeholder="e.g. Fuel pump" required />
          </label>
          <label className="field">
            <span>Quantity</span>
            <input type="number" min="0" value={form.quantity} onChange={setField("quantity")} required />
          </label>
          <button type="submit" className="btn btn-primary">Add part</button>
        </form>
        {error && <p className="error" role="alert">{error}</p>}
      </section>

      <section className="panel">
        <Table
          rowKey="partNo"
          columns={[
            { key: "partNo", label: "Part no." },
            { key: "name", label: "Name" },
            { key: "quantity", label: "Quantity", align: "right" },
            {
              key: "stock",
              label: "Stock",
              render: (r) => <StatusBadge status={r.quantity < LOW_STOCK_LIMIT ? "Low stock" : "OK"} />,
            },
          ]}
          rows={parts}
          empty="No parts in stock yet."
          actions={(row) => (
            <>
              <button type="button" className="btn btn-small" onClick={() => adjust(row.partNo, -1)} aria-label={`Remove one ${row.name}`}>−</button>
              <button type="button" className="btn btn-small" onClick={() => adjust(row.partNo, 1)} aria-label={`Add one ${row.name}`}>+</button>
            </>
          )}
        />
      </section>
    </>
  );
}
