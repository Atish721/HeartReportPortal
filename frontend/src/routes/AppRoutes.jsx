import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login.jsx";
import PatientInfo from "../pages/PatientInfo.jsx";
import HealthMetrics from "../pages/HealthMetrics.jsx";
import ECGUpload from "../pages/ECGUpload.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />

    <Route
      path="/patient"
      element={
        <ProtectedRoute>
          <PatientInfo />
        </ProtectedRoute>
      }
    />

    <Route
      path="/health"
      element={
        <ProtectedRoute>
          <HealthMetrics />
        </ProtectedRoute>
      }
    />

    <Route
      path="/ecg"
      element={
        <ProtectedRoute>
          <ECGUpload />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<Login />} />
  </Routes>
);

export default AppRoutes;
