import { useState, useEffect, useCallback } from "react";
import Table from "../components/Table";
import StatusBadge from "../components/StatusBadge";
import { api } from "../api";

export default function LegacyDataset() {
  const [records, setRecords] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("page", page);
      if (search.trim()) params.set("search", search.trim());
      if (priorityFilter) params.set("priority", priorityFilter);
      if (statusFilter) params.set("status", statusFilter);

      const res = await api.get(`/legacy-maintenance/?${params.toString()}`);
      setRecords(res.results || []);
      setTotalCount(res.count || 0);
    } catch (err) {
      setError(err.message || "Failed to load historical records");
    } finally {
      setLoading(false);
    }
  }, [page, search, priorityFilter, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalPages = Math.ceil(totalCount / 100);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Historical Maintenance Dataset</h1>
          <p style={{ color: "#6b7280", margin: "0.25rem 0 0 0" }}>
            Querying {totalCount.toLocaleString()} real-world maintenance logs from MySQL
          </p>
        </div>
      </div>

      <section className="panel">
        <form className="form-row" onSubmit={handleSearchSubmit}>
          <label className="field field-grow">
            <span>Search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search aircraft, technician, part no, or type..."
            />
          </label>
          <label className="field">
            <span>Priority</span>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </label>
          <label className="field">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <button type="submit" className="btn btn-primary">
            Filter
          </button>
        </form>

        {error && (
          <div className="banner" style={{ background: "#fee2e2", color: "#b91c1c", marginTop: "1rem" }} role="alert">
            {error}
          </div>
        )}
      </section>

      <section className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>
            Showing page {page} of {totalPages || 1} ({records.length} records on this page)
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              className="btn btn-small"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-small"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>Loading historical records...</div>
        ) : (
          <Table
            rowKey="record_id"
            columns={[
              { key: "record_id", label: "ID" },
              { key: "aircraft_code", label: "Aircraft" },
              { key: "model", label: "Model" },
              { key: "maintenance_type", label: "Type" },
              { key: "technician", label: "Technician" },
              {
                key: "priority",
                label: "Priority",
                render: (r) => <StatusBadge status={r.priority ? r.priority.toUpperCase() : "NORMAL"} />,
              },
              {
                key: "status",
                label: "Status",
                render: (r) => <StatusBadge status={r.status ? r.status.replace("_", " ") : "N/A"} />,
              },
              { key: "flight_hours", label: "Hours", align: "right" },
              { key: "part_no", label: "Part" },
              { key: "quantity_used", label: "Qty", align: "right" },
              {
                key: "cost",
                label: "Cost",
                align: "right",
                render: (r) => (r.cost ? `$${Number(r.cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "$0.00"),
              },
              { key: "maintenance_date", label: "Date" },
            ]}
            rows={records}
            empty="No records found matching query."
          />
        )}
      </section>
    </>
  );
}
