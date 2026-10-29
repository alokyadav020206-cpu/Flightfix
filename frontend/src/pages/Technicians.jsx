import { useState } from "react";
import Table from "../components/Table";
import StatusBadge from "../components/StatusBadge";
import { useData } from "../context/DataContext";

export default function Technicians() {
  const { technicians, workOrders } = useData();
  const [selectedId, setSelectedId] = useState(null);

  // A technician counts as Assigned while they have any work order that isn't completed.
  const rows = technicians.map((t) => {
    const open = workOrders.filter((w) => w.technician === t.name && w.status !== "Completed").length;
    return { ...t, open, status: open > 0 ? "Assigned" : "Available" };
  });

  const selected = rows.find((t) => t.id === selectedId);
  const assigned = selected ? workOrders.filter((w) => w.technician === selected.name) : [];

  return (
    <>
      <div className="page-head">
        <h1>Technicians</h1>
      </div>

      <section className="panel">
        <Table
          columns={[
            { key: "name", label: "Name" },
            { key: "specialty", label: "Specialty" },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            { key: "open", label: "Open work orders", align: "right" },
          ]}
          rows={rows}
          empty="No technicians yet."
          actions={(row) => (
            <button type="button" className="btn btn-small" onClick={() => setSelectedId(row.id)}>
              View work orders
            </button>
          )}
        />
      </section>

      {selected && (
        <section className="panel">
          <h2>Work orders for {selected.name}</h2>
          <Table
            columns={[
              { key: "id", label: "Work order" },
              { key: "aircraft", label: "Aircraft" },
              { key: "task", label: "Task" },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={assigned}
            empty={`${selected.name} has no work orders.`}
          />
        </section>
      )}
    </>
  );
}
