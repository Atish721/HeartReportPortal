import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login.jsx";
import PatientInfo from "../pages/PatientInfo.jsx";
import HealthMetrics from "../pages/HealthMetrics.jsx";
import ECGUpload from "../pages/ECGUpload.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ProtectedLayout from "../layouts/ProtectedLayout.jsx";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />

    <Route
      path="/patient"
      element={
        <ProtectedRoute>
          <ProtectedLayout>
            <PatientInfo />
          </ProtectedLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/health"
      element={
        <ProtectedRoute>
          <ProtectedLayout>
            <HealthMetrics />
          </ProtectedLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/ecg"
      element={
        <ProtectedRoute>
          <ProtectedLayout>
            <ECGUpload />
          </ProtectedLayout>
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<Login />} />
  </Routes>
);

export default AppRoutes;
