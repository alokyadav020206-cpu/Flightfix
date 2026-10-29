import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Aircraft from "./pages/Aircraft";
import Maintenance from "./pages/Maintenance";
import WorkOrders from "./pages/WorkOrders";
import SpareParts from "./pages/SpareParts";
import Technicians from "./pages/Technicians";
import LegacyDataset from "./pages/LegacyDataset";
import { currentUser } from "./auth";

function Protected({ children }) {
  return currentUser() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aircraft" element={<Aircraft />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/work-orders" element={<WorkOrders />} />
        <Route path="/spare-parts" element={<SpareParts />} />
        <Route path="/technicians" element={<Technicians />} />
        <Route path="/legacy-dataset" element={<LegacyDataset />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
