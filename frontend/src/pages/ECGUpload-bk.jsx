import { useState } from "react";
import { generateReportApi } from "../services/api";
import { useAuth } from "../auth/AuthContext";

const ECGUpload = () => {
  const [ecgBase64, setEcgBase64] = useState("");
  const { token } = useAuth();

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setEcgBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const generateReport = async () => {
    const blob = await generateReportApi({
      patient: { name: "John", age: 45, gender: "Male" },
      healthMetrics: { bp: "120/80", spo2: 98, sugar: 100, cholesterol: 180 },
      lipidProfile: { ldl: 90, hdl: 55, triglycerides: 140 },
      lifestyle: ["Smoking"],
      ecgImageBase64: ecgBase64
    }, token);

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Patient_ECG_Report.pdf";
    a.click();
  };

  return (
    <div className="container">
      <div className="card">
        <p style={{ fontSize: "13px", color: "#999" }}>
          Step 3 of 3
        </p>

        <h2>Upload ECG Report</h2>

        <div className="upload-box">
          <input type="file" onChange={handleFile} />
        </div>

        <button onClick={generateReport}>
          Generate & Download Report
        </button>
      </div>
    </div>
  );

};

export default ECGUpload;
