import Card from "../components/Card";
import Table from "../components/Table";
import StatusBadge, { toneOf } from "../components/StatusBadge";
import { useData } from "../context/DataContext";
import { LOW_STOCK_LIMIT, WORK_ORDER_STATUSES } from "../data";
import { formatDate } from "../utils";

export default function Dashboard() {
  const { aircraft, maintenance, workOrders, parts } = useData();

  const underMaintenance = aircraft.filter((a) => a.status === "Maintenance").length;
  const openOrders = workOrders.filter((w) => w.status !== "Completed");
  const lowStock = parts.filter((p) => p.quantity < LOW_STOCK_LIMIT);
  const upcoming = [...maintenance].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5);

  return (
    <>
      <div className="page-head">
        <h1>Dashboard</h1>
      </div>

      <div className="stat-strip">
        <Card to="/aircraft" value={aircraft.length} label="Aircraft" />
        <Card to="/aircraft" value={underMaintenance} label="Under maintenance" tone={underMaintenance ? "warn" : undefined} />
        <Card to="/work-orders" value={openOrders.length} label="Open work orders" />
        <Card to="/maintenance" value={maintenance.length} label="Upcoming maintenance" />
        <Card to="/spare-parts" value={lowStock.length} label="Low stock parts" tone={lowStock.length ? "warn" : undefined} />
      </div>

      <div className="grid-2">
        <section className="panel">
          <h2>Next maintenance due</h2>
          <Table
            columns={[
              { key: "aircraft", label: "Aircraft" },
              { key: "task", label: "Task" },
              { key: "dueDate", label: "Due", render: (r) => formatDate(r.dueDate) },
            ]}
            rows={upcoming}
            empty="No maintenance scheduled."
          />
        </section>

        <section className="panel">
          <h2>Open work orders</h2>
          <Table
            columns={[
              { key: "id", label: "Work order" },
              { key: "aircraft", label: "Aircraft" },
              { key: "task", label: "Task" },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={openOrders}
            empty="All work orders are complete."
          />
        </section>
      </div>

      <div className="grid-2">
        <section className="panel">
          <h2>Work orders by status</h2>
          <div className="bars">
            {WORK_ORDER_STATUSES.map((s) => {
              const n = workOrders.filter((w) => w.status === s).length;
              const pct = workOrders.length ? Math.round((n / workOrders.length) * 100) : 0;
              return (
                <div className="bar-row" key={s}>
                  <span>{s}</span>
                  <div className="bar-track">
                    <div className={`bar-fill bar-${toneOf(s)}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="bar-count">{n}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel">
          <h2>Parts to reorder</h2>
          <Table
            rowKey="partNo"
            columns={[
              { key: "partNo", label: "Part no." },
              { key: "name", label: "Name" },
              { key: "quantity", label: "In stock", align: "right" },
            ]}
            rows={lowStock}
            empty="All parts are above the minimum."
          />
        </section>
      </div>
    </>
  );
}
