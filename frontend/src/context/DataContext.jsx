import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { currentUser } from "../auth";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [aircraft, setAircraftState] = useState([]);
  const [maintenance, setMaintenanceState] = useState([]);
  const [workOrders, setWorkOrdersState] = useState([]);
  const [parts, setPartsState] = useState([]);
  const [technicians, setTechniciansState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshAll = useCallback(async () => {
    if (!currentUser()) return;
    setLoading(true);
    setError(null);
    try {
      const [acRes, msRes, woRes, spRes, tcRes] = await Promise.all([
        api.get("/aircraft/").catch(() => ({ results: [] })),
        api.get("/maintenance-schedules/").catch(() => ({ results: [] })),
        api.get("/work-orders/").catch(() => ({ results: [] })),
        api.get("/spare-parts/").catch(() => ({ results: [] })),
        api.get("/technicians/").catch(() => ({ results: [] })),
      ]);

      const rawAc = acRes.results || (Array.isArray(acRes) ? acRes : []);
      setAircraftState(
        rawAc.map((a) => ({
          id: a.id,
          registration: a.registration_number,
          model: a.model,
          manufacturer: a.manufacturer,
          status:
            a.status === "ACTIVE"
              ? "Active"
              : a.status === "IN_MAINTENANCE"
              ? "Maintenance"
              : a.status === "GROUNDED"
              ? "Grounded"
              : a.status,
          raw: a,
        }))
      );

      const rawMs = msRes.results || (Array.isArray(msRes) ? msRes : []);
      setMaintenanceState(
        rawMs.map((m) => ({
          id: m.id,
          aircraft:
            m.aircraft_registration ||
            (typeof m.aircraft === "object" ? m.aircraft?.registration_number : m.aircraft) ||
            "Fleet",
          task: m.title,
          dueDate: m.scheduled_date,
          status: m.status,
          raw: m,
        }))
      );

      const rawWo = woRes.results || (Array.isArray(woRes) ? woRes : []);
      setWorkOrdersState(
        rawWo.map((w) => ({
          id: w.order_number || `WO-${w.id}`,
          internalId: w.id,
          aircraft:
            w.aircraft_registration ||
            (typeof w.aircraft === "object" ? w.aircraft?.registration_number : w.aircraft) ||
            "Fleet",
          task: w.title,
          technician: w.technician_names?.[0] || "",
          status:
            w.status === "COMPLETED"
              ? "Completed"
              : w.status === "IN_PROGRESS"
              ? "In Progress"
              : "Scheduled",
          raw: w,
        }))
      );

      const rawSp = spRes.results || (Array.isArray(spRes) ? spRes : []);
      setPartsState(
        rawSp.map((p) => ({
          id: p.id,
          partNo: p.part_number,
          name: p.name,
          quantity: p.quantity_in_stock,
          reorderLevel: p.reorder_level,
          raw: p,
        }))
      );

      const rawTc = tcRes.results || (Array.isArray(tcRes) ? tcRes : []);
      setTechniciansState(
        rawTc.map((t) => ({
          id: t.id,
          name: t.name,
          specialty: t.specialization || "General",
          raw: t,
        }))
      );
    } catch (err) {
      console.error("Failed to load data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const value = {
    aircraft,
    setAircraft: setAircraftState,
    maintenance,
    setMaintenance: setMaintenanceState,
    workOrders,
    setWorkOrders: setWorkOrdersState,
    parts,
    setParts: setPartsState,
    technicians,
    loading,
    error,
    refreshAll,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}
