import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReport } from "../context/ReportContext";
import { useAuth } from "../auth/AuthContext";
import { generateReportApi } from "../services/api";
import "../assets/styles/ECGAnalysis.css";

const ECGUpload = () => {
  const navigate = useNavigate();

  // ✅ Hooks MUST be inside component
  const { patient, healthMetrics, lipidProfile, lifestyle } = useReport();
  const { token } = useAuth();

  const [ecgImage, setEcgImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Only JPG, PNG, JPEG allowed");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setEcgImage(file);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateReport = async () => {
    if (!preview) {
      alert("Please upload ECG image");
      return;
    }

    if (!patient || !healthMetrics || !lipidProfile) {
      alert("Incomplete data. Please start again.");
      navigate("/patient");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        patient,
        healthMetrics,
        lipidProfile,
        lifestyle,
        ecgImageBase64: preview
      };

      const blob = await generateReportApi(payload, token);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Patient_ECG_Report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to generate report");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ecg-analysis-container">
      <div className="ecg-analysis-card">
        <h2>Upload ECG Image</h2>

        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleImageUpload}
        />

        {preview && (
          <img
            src={preview}
            alt="ECG Preview"
            className="ecg-preview-image"
          />
        )}

        <button
          className="generate-button"
          onClick={handleGenerateReport}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Report →"}
        </button>
      </div>
    </div>
  );
};

export default ECGUpload;
