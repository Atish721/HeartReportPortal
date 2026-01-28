import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReport } from "../context/ReportContext.jsx";

import '../assets/styles/PatientInfo.css'


const PatientInfo = () => {

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { setPatient, setHealthMetrics } = useReport();

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    bloodPressureRaw: "",
    oxygenPulse: "",
    bloodSugar: "",
    totalCholesterol: ""
  });


  const validate = (data) => {
    const errors = {};

    const spo2 = Number(data.oxygenPulse);
    const sugar = Number(data.bloodSugar);
    const cholesterol = Number(data.totalCholesterol);

    if (!data.fullName || data.fullName.length < 3) {
      errors.fullName = "Please enter a valid full name";
    }

    if (!data.age || data.age < 0 || data.age > 120) {
      errors.age = "Age must be between 0 and 120";
    }

    if (!data.gender) {
      errors.gender = "Please select a gender";
    }

    if (!data.bloodPressureRaw) {
      errors.bloodPressure = "Field is required";
    } else if (!/^\d{2,3}\/\d{2,3}$/.test(data.bloodPressureRaw)) {
      errors.bloodPressure = "Format should be like 120/80";
    }

    if (data.oxygenPulse === "") {
      errors.oxygenPulse = "Field is required";
    } else if (spo2 < 0 || spo2 > 100) {
      errors.oxygenPulse = "SpO₂ must be between 0 and 100";
    }

    if (data.bloodSugar === "") {
      errors.bloodSugar = "Field is required";
    } else if (sugar < 0 || sugar > 500) {
      errors.bloodSugar = "Blood Sugar must be between 0 and 500";
    }

    if (data.totalCholesterol === "") {
      errors.totalCholesterol = "Field is required";
    } else if (cholesterol < 0 || cholesterol > 200) {
      errors.totalCholesterol = "Cholesterol must be below 200";
    }

    return errors;
  };

  const validateField = (field) => {
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setTouched(prev => ({ ...prev, [field]: true }));
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    setTouched({
      fullName: true,
      age: true,
      gender: true,
      bloodPressure: true,
      oxygenPulse: true,
      bloodSugar: true,
      totalCholesterol: true
    });

    if (Object.keys(validationErrors).length > 0) return;

    const [systolic, diastolic] =
      formData.bloodPressureRaw?.split("/") || [];

    setPatient({
      name: formData.fullName,
      age: Number(formData.age),
      gender: formData.gender
    });

    setHealthMetrics({
      bp: systolic && diastolic ? `${systolic}/${diastolic}` : null,
      spo2: formData.oxygenPulse ? Number(formData.oxygenPulse) : null,
      sugar: formData.bloodSugar ? Number(formData.bloodSugar) : null,
      cholesterol: formData.totalCholesterol
        ? Number(formData.totalCholesterol)
        : null
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
                  className={`form-input ${errors.fullName ? "error" : ""}`}

                  placeholder="Enter your full name"
                  value={formData.fullName}
                  // onBlur={() => setTouched(prev => ({ ...prev, fullName: true }))}
                  onChange={handleChange}

                />
                {touched.fullName && errors.fullName && (
                  <div className="field-error">{errors.fullName}</div>
                )}

              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="age" className="form-label">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    className={`form-input ${errors.age ? "error" : ""}`}

                    placeholder="Years"
                    value={formData.age}
                    // onBlur={() => setTouched(prev => ({ ...prev, age: true }))}
                    onChange={handleChange}
                    min="0"
                    max="120"

                  />
                  {touched.age && errors.age && (
                    <div className="field-error">{errors.age}</div>
                  )}

                </div>

                <div className="form-group">
                  <label htmlFor="gender" className="form-label">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    className={`form-select ${errors.gender ? "error" : ""}`}

                    value={formData.gender}
                    // onBlur={() => setTouched(prev => ({ ...prev, gender: true }))}
                    onChange={handleChange}

                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {touched.gender && errors.gender && (
                    <div className="field-error">{errors.gender}</div>
                  )}

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
                  className={`metric-input form-select ${errors.bloodPressure ? "error" : ""}`}

                  placeholder="e.g., 120/80"
                  value={formData.bloodPressureRaw}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      bloodPressureRaw: e.target.value
                    }))
                  }
                  onBlur={() => validateField("bloodPressure")}
                />

                {touched.bloodPressure && errors.bloodPressure && (
                  <div className="field-error">{errors.bloodPressure}</div>
                )}



                <div className="metric-note">Normal: 120/80 mmHg</div>
              </div>

              <div className="metric-card">
                <label className="metric-label">Oxygen Pulse (SpO2 %)</label>
                <input
                  type="number"
                  className={`metric-input form-select ${errors.oxygenPulse ? "error" : ""}`}

                  placeholder="e.g., 98"
                  onBlur={() => validateField("oxygenPulse")}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      oxygenPulse: e.target.value
                    }));
                  }}
                  min="0"
                  max="100"
                />
                {touched.oxygenPulse && errors.oxygenPulse && (
                  <div className="field-error">{errors.oxygenPulse}</div>
                )}
                <div className="metric-note">Normal: 95-100%</div>
              </div>

              <div className="metric-card">
                <label className="metric-label">Blood Sugar Level (mg/dL)</label>
                <input
                  type="number"
                  className={`metric-input form-select ${errors.bloodSugar ? "error" : ""}`}

                  placeholder="e.g., 100"
                  onBlur={() => validateField("bloodSugar")}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      bloodSugar: e.target.value
                    }));
                  }}
                  min="0"
                />
                {touched.bloodSugar && errors.bloodSugar && (
                  <div className="field-error">{errors.bloodSugar}</div>
                )}
                <div className="metric-note">Fasting normal: 70-100 mg/dL</div>
              </div>

              <div className="metric-card">
                <label className="metric-label">Total Cholesterol (mg/dL)</label>
                <input
                  type="number"
                  className={`metric-input form-select ${errors.totalCholesterol ? "error" : ""}`}

                  placeholder="e.g., 200"
                  onBlur={() => validateField("totalCholesterol")}

                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      totalCholesterol: e.target.value
                    }));
                  }}
                  min="0"
                />
                {touched.totalCholesterol && errors.totalCholesterol && (
                  <div className="field-error">{errors.totalCholesterol}</div>
                )}
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
          <div className="steps-container">
            <div className="step active">1</div>
            <div className="step-line"></div>
            <div className="step">2</div>
            <div className="step-line"></div>
            <div className="step">3</div>
          </div>
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