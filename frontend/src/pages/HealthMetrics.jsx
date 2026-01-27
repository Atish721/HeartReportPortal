import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useReport } from "../context/ReportContext";

import '../assets/styles/HealthMetrics.css';

const HealthMetrics = () => {
  const navigate = useNavigate();
  const { setHealthMetrics, setLipidProfile, setLifestyle, patient } = useReport();

  const [formData, setFormData] = useState({
    lipidProfile: {
      ldlCholesterol: "",
      hdlCholesterol: "",
      triglycerides: ""
    },
    lifestyleHabits: {
      smoking: false,
      drinking: false,
      tobacco: false
    }
  });

  useEffect(() => {
    if (!patient) {
      navigate("/patient");
    }
  }, [patient, navigate]);

  const handleLipidChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      lipidProfile: {
        ...prev.lipidProfile,
        [field]: value
      }
    }));
  };

  const handleHabitToggle = (habit) => {
    setFormData(prev => ({
      ...prev,
      lifestyleHabits: {
        ...prev.lifestyleHabits,
        [habit]: !prev.lifestyleHabits[habit]
      }
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    setHealthMetrics({
      bp: "N/A", // or remove BP from this page
      spo2: null,
      sugar: null,
      cholesterol: null
    });

    setLipidProfile({
      ldl: Number(formData.lipidProfile.ldlCholesterol),
      hdl: Number(formData.lipidProfile.hdlCholesterol),
      triglycerides: Number(formData.lipidProfile.triglycerides)
    });

    setLifestyle(
      Object.keys(formData.lifestyleHabits)
        .filter(habit => formData.lifestyleHabits[habit])
    );

    navigate("/ecg");
  };


  const handleBack = () => {
    navigate("/patient");
  };

  return (
    <div className="health-metrics-container">
      <div className="health-metrics-card">
        <div className="portal-header">
          <h1 className="portal-title">HeartBuddy</h1>
          <h2 className="page-title">Health Metrics</h2>
        </div>

        <form onSubmit={handleSubmit} className="health-metrics-form">
          <div className="form-section">
            <h3 className="section-title">Lipid Profile</h3>
            <p className="section-description">
              Enter your lipid panel values for comprehensive heart health assessment
            </p>

            <div className="lipid-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <label className="metric-label">LDL Cholesterol (mg/dL)</label>
                  <div className="metric-example">e.g., 100</div>
                </div>
                <input
                  type="number"
                  className="metric-input"
                  placeholder="Enter value"
                  value={formData.lipidProfile.ldlCholesterol}
                  onChange={(e) => handleLipidChange("ldlCholesterol", e.target.value)}
                  min="0"
                />
                <div className="metric-note optimal">
                  <span className="metric-status">Optimal:</span>
                  <span className="metric-value">&lt;100 mg/dL</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <label className="metric-label">HDL Cholesterol (mg/dL)</label>
                  <div className="metric-example">e.g., 50</div>
                </div>
                <input
                  type="number"
                  className="metric-input"
                  placeholder="Enter value"
                  value={formData.lipidProfile.hdlCholesterol}
                  onChange={(e) => handleLipidChange("hdlCholesterol", e.target.value)}
                  min="0"
                />
                <div className="metric-note optimal">
                  <span className="metric-status">Optimal:</span>
                  <span className="metric-value">&gt;60 mg/dL</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <label className="metric-label">Triglycerides (mg/dL)</label>
                  <div className="metric-example">e.g., 150</div>
                </div>
                <input
                  type="number"
                  className="metric-input"
                  placeholder="Enter value"
                  value={formData.lipidProfile.triglycerides}
                  onChange={(e) => handleLipidChange("triglycerides", e.target.value)}
                  min="0"
                />
                <div className="metric-note normal">
                  <span className="metric-status">Normal:</span>
                  <span className="metric-value">&lt;150 mg/dL</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Lifestyle Habits</h3>
            <p className="section-description">
              Select any habits that apply to you
            </p>

            <div className="habits-grid">
              <div
                className={`habit-card ${formData.lifestyleHabits.smoking ? "selected" : ""}`}
                onClick={() => handleHabitToggle("smoking")}
              >
                <div className="habit-icon">🚬</div>
                <div className="habit-content">
                  <div className="habit-label">Smoking</div>
                  <div className="habit-status">
                    {formData.lifestyleHabits.smoking ? "Selected" : "Not Selected"}
                  </div>
                </div>
                <div className="habit-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.lifestyleHabits.smoking}
                    onChange={() => handleHabitToggle("smoking")}
                    className="hidden-checkbox"
                  />
                  <div className="custom-checkbox">
                    {formData.lifestyleHabits.smoking && (
                      <div className="checkmark">✓</div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`habit-card ${formData.lifestyleHabits.drinking ? "selected" : ""}`}
                onClick={() => handleHabitToggle("drinking")}
              >
                <div className="habit-icon">🍷</div>
                <div className="habit-content">
                  <div className="habit-label">Drinking</div>
                  <div className="habit-status">
                    {formData.lifestyleHabits.drinking ? "Selected" : "Not Selected"}
                  </div>
                </div>
                <div className="habit-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.lifestyleHabits.drinking}
                    onChange={() => handleHabitToggle("drinking")}
                    className="hidden-checkbox"
                  />
                  <div className="custom-checkbox">
                    {formData.lifestyleHabits.drinking && (
                      <div className="checkmark">✓</div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`habit-card ${formData.lifestyleHabits.tobacco ? "selected" : ""}`}
                onClick={() => handleHabitToggle("tobacco")}
              >
                <div className="habit-icon">🚭</div>
                <div className="habit-content">
                  <div className="habit-label">Tobacco</div>
                  <div className="habit-status">
                    {formData.lifestyleHabits.tobacco ? "Selected" : "Not Selected"}
                  </div>
                </div>
                <div className="habit-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.lifestyleHabits.tobacco}
                    onChange={() => handleHabitToggle("tobacco")}
                    className="hidden-checkbox"
                  />
                  <div className="custom-checkbox">
                    {formData.lifestyleHabits.tobacco && (
                      <div className="checkmark">✓</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="back-button" onClick={handleBack}>
              ← Back
            </button>
            <button type="submit" className="continue-button">
              Continue to ECG Analysis →
            </button>
          </div>
        </form>

        <div className="step-indicator">
          <div className="step">1</div>
          <div className="step-line"></div>
          <div className="step active">2</div>
          <div className="step-line"></div>
          <div className="step">3</div>
          <div className="step-labels">
            <span className="step-label">Patient Info</span>
            <span className="step-label active">Health Metrics</span>
            <span className="step-label">ECG Analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthMetrics;