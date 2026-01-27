import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReport } from "../context/ReportContext.jsx";

import '../assets/styles/PatientInfo.css'


const PatientInfo = () => {
  const navigate = useNavigate();
  const { setPatient } = useReport(); 
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setPatient({
      name: formData.fullName,
      age: Number(formData.age),
      gender: formData.gender
    });
    navigate("/health");
  };


  return (
    <div className="patient-info-container">
      <div className="patient-info-card">
        <div className="portal-header">
          <h1 className="portal-title">HeartBuddy</h1>
          <h2 className="page-title">Patient Information</h2>

          <div className="medical-disclaimer">
            <div className="disclaimer-icon">⚠️</div>
            <div className="disclaimer-text">
              Medical Disclaimer: This tool is for educational and informational purposes only.
              It is not intended to replace professional medical advice, diagnosis, or treatment.
              Always consult a qualified healthcare provider for medical concerns.
              ECG analysis results should be verified by a licensed cardiologist.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="patient-info-form">
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="age" className="form-label">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    className="form-input"
                    placeholder="Years"
                    value={formData.age}
                    onChange={handleChange}
                    min="0"
                    max="120"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender" className="form-label">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Health Metrics</h3>

            <div className="metrics-grid">
              <div className="metric-card">
                <label className="metric-label">Blood Pressure (mmHg)</label>
                <input
                  type="text"
                  className="metric-input"
                  placeholder="e.g., 120/80"
                  onChange={(e) => {
                    const [systolic, diastolic] = e.target.value.split('/');
                    setFormData(prev => ({
                      ...prev,
                      bloodPressure: { systolic, diastolic }
                    }));
                  }}
                />
                <div className="metric-note">Normal: 120/80 mmHg</div>
              </div>

              <div className="metric-card">
                <label className="metric-label">Oxygen Pulse (SpO2 %)</label>
                <input
                  type="number"
                  className="metric-input"
                  placeholder="e.g., 98"
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      oxygenPulse: e.target.value
                    }));
                  }}
                  min="0"
                  max="100"
                />
                <div className="metric-note">Normal: 95-100%</div>
              </div>

              <div className="metric-card">
                <label className="metric-label">Blood Sugar Level (mg/dL)</label>
                <input
                  type="number"
                  className="metric-input"
                  placeholder="e.g., 100"
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      bloodSugar: e.target.value
                    }));
                  }}
                  min="0"
                />
                <div className="metric-note">Fasting normal: 70-100 mg/dL</div>
              </div>

              <div className="metric-card">
                <label className="metric-label">Total Cholesterol (mg/dL)</label>
                <input
                  type="number"
                  className="metric-input"
                  placeholder="e.g., 200"
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      totalCholesterol: e.target.value
                    }));
                  }}
                  min="0"
                />
                <div className="metric-note">Desirable: Less than 200 mg/dL</div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="next-button">
              Continue to Health Metrics →
            </button>
          </div>
        </form>

        <div className="step-indicator">
          <div className="step active">1</div>
          <div className="step-line"></div>
          <div className="step">2</div>
          <div className="step-line"></div>
          <div className="step">3</div>
          <div className="step-labels">
            <span className="step-label active">Patient Info</span>
            <span className="step-label">Health Metrics</span>
            <span className="step-label">ECG Analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;