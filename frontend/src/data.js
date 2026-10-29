// Dummy data. Replaced by Django API responses later.
export const LOW_STOCK_LIMIT = 10;
export const WORK_ORDER_STATUSES = ["Scheduled", "In Progress", "Completed"];

export const aircraft = [
  { id: 1, registration: "A320-001", model: "Airbus A320", status: "Active" },
  { id: 2, registration: "B737-002", model: "Boeing 737", status: "Maintenance" },
  { id: 3, registration: "A320-003", model: "Airbus A320", status: "Active" },
  { id: 4, registration: "ATR-004", model: "ATR 72", status: "Active" },
];

export const maintenance = [
  { id: 1, aircraft: "A320-001", task: "Engine Inspection", dueDate: "2026-10-15" },
  { id: 2, aircraft: "B737-002", task: "Brake Inspection", dueDate: "2026-10-20" },
  { id: 3, aircraft: "A320-003", task: "Landing Gear Check", dueDate: "2026-11-02" },
  { id: 4, aircraft: "ATR-004", task: "Cabin Pressure Test", dueDate: "2026-11-18" },
];

export const workOrders = [
  { id: "WO-101", aircraft: "A320-001", task: "Engine Check", status: "In Progress", technician: "Rahul" },
  { id: "WO-102", aircraft: "B737-002", task: "Brake Check", status: "Completed", technician: "Rohit" },
  { id: "WO-103", aircraft: "A320-003", task: "Oil Check", status: "Scheduled", technician: "Amit" },
];

export const parts = [
  { partNo: "P-101", name: "Brake Pad", quantity: 24 },
  { partNo: "P-102", name: "Oil Filter", quantity: 15 },
  { partNo: "P-103", name: "Valve", quantity: 8 },
  { partNo: "P-104", name: "Hydraulic Seal", quantity: 5 },
];

export const technicians = [
  { id: 1, name: "Rahul", specialty: "Engine" },
  { id: 2, name: "Amit", specialty: "Electrical" },
  { id: 3, name: "Rohit", specialty: "Mechanical" },
];
