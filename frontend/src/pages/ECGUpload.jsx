import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReport } from "../context/ReportContext";
import { useAuth } from "../auth/AuthContext";
import { generateReportApi } from "../services/api";
import "../assets/styles/ECGAnalysis.css";


const ECGUpload = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ✅ Hooks MUST be inside component
  const { patient, healthMetrics, lipidProfile, lifestyle } = useReport();
  const { token } = useAuth();

  const [ecgImage, setEcgImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  // const [analysis, setAnalysis] = useState(null); // Added for UI display
  // const [analyzing, setAnalyzing] = useState(false); // Added for analysis loading
  const validate = () => {
    const errors = {};

    if (!ecgImage || !preview) {
      errors.ecgImage = "ECG image is required";
    }

    return errors;
  };

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!validTypes.includes(file.type)) {
      return "Only JPG, PNG, JPEG files are allowed";
    }

    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5 MB";
    }

    return null;
  };



  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileError = validateFile(file);
    if (fileError) {
      setErrors({ ecgImage: fileError });
      setTouched({ ecgImage: true });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setEcgImage(file);
      setErrors({});
    };
    reader.readAsDataURL(file);
  };


  // Add drag and drop functionality
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (file) => {
    const fileError = validateFile(file);
    if (fileError) {
      setErrors({ ecgImage: fileError });
      setTouched({ ecgImage: true });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setEcgImage(file);
      setErrors({});
    };
    reader.readAsDataURL(file);
  };




  const handleGenerateReport = async () => {
    setTouched({ ecgImage: true });

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    if (!patient || !healthMetrics || !lipidProfile) {
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

      // download file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `HeartBuddy_Report_${patient.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // ✅ RESET STATE
      setEcgImage(null);
      setPreview(null);
      setErrors({});
      setTouched({});

      // ✅ REDIRECT AFTER DOWNLOAD
      setTimeout(() => {
        navigate("/patient");
      }, 300);

    } catch (err) {
      console.error(err);
      alert("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };



  const handleRemoveImage = () => {
    setEcgImage(null);
    setPreview(null);
    // setAnalysis(null);
  };

  const handleBack = () => {
    navigate("/health");
  };

  return (
    <div className="ecg-upload-container">
      <div className="ecg-upload-card">
        <div className="portal-header">
          <h1 className="portal-title">HeartBuddy</h1>
          <h2 className="page-title">ECG Analysis</h2>
          <p className="page-subtitle">Upload your ECG image for AI-powered analysis</p>
        </div>

        <div className="ecg-content">
          <div
            className={`upload-area ${isDragging ? "dragging" : ""} ${preview ? "has-image" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !preview && document.getElementById("ecg-upload").click()}
          >
            <input
              type="file"
              id="ecg-upload"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />

            {preview ? (
              <div className="image-preview-container">
                <img src={preview} alt="ECG Preview" className="ecg-preview-image" />
                <button
                  className="remove-image-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                >
                  Remove Image
                </button>
              </div>

            ) : (
              <>
                <div className="upload-icon">📤</div>
                <p className="upload-text">Drop your ECG image here</p>
                <p className="upload-subtext">or click to browse files</p>
                <p className="upload-formats">Supports: JPG, PNG, JPEG</p>

              </>
            )}
            {touched.ecgImage && errors.ecgImage && (
              <div className="field-error">{errors.ecgImage}</div>
            )}
          </div>


        </div>

        <div className="form-actions">
          <button type="button" className="back-button" onClick={handleBack}>
            ← Back to Patient Details
          </button>
          <button
            className="generate-button"
            onClick={handleGenerateReport}
            disabled={loading || !preview}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Generating...
              </>
            ) : "Generate Report →"}
          </button>
        </div>

        <div className="step-indicator">
          <div className="steps-container">
            <div className="step">1</div>
            <div className="step-line"></div>
            <div className="step">2</div>
            <div className="step-line"></div>
            <div className="step active">3</div>
          </div>
          <div className="step-labels">
            <span className="step-label">Patient Info</span>
            <span className="step-label">Health Metrics</span>
            <span className="step-label active">ECG Analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECGUpload;