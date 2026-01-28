export const generateReportHTML = (data) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getHealthStatus = (value, min, max) => {
    if (value < min) return 'Low';
    if (value > max) return 'High';
    return 'Normal';
  };

  // Helper to format blood pressure
  const formatBP = (bp) => {
    if (!bp) return 'N/A';
    const [systolic, diastolic] = bp.split('/');
    const status = getBpStatus(systolic, diastolic);
    return `${bp} mmHg <span class="status-badge ${status}">${status}</span>`;
  };

  const getBpStatus = (systolic, diastolic) => {
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);

    if (sys < 90 || dia < 60) return 'low';
    if (sys >= 140 || dia >= 90) return 'high';
    if ((sys >= 120 && sys < 140) || (dia >= 80 && dia < 90)) return 'elevated';
    return 'normal';
  };

  // Helper to get cholesterol status
  const getCholesterolStatus = (value) => {
    if (!value) return 'normal';
    const num = parseInt(value);
    if (num < 200) return 'normal';
    if (num >= 200 && num < 240) return 'borderline';
    return 'high';
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    /* Reset and Base Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #2d3748;
      background: #ffffff;
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    /* Header Styles */
    .report-header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 2px solid #e2e8f0;
    }
    
    .portal-title {
      font-size: 36px;
      color: #1a202c;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    
    .report-title {
      font-size: 28px;
      color: #4299e1;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .report-subtitle {
      font-size: 16px;
      color: #718096;
      margin-bottom: 20px;
    }
    
    .report-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 30px;
      border: 1px solid #e2e8f0;
    }
    
    .meta-item {
      text-align: center;
      flex: 1;
    }
    
    .meta-label {
      font-size: 13px;
      color: #718096;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      font-weight: 500;
    }
    
    .meta-value {
      font-size: 18px;
      color: #2d3748;
      font-weight: 600;
    }
    
    /* Section Styles */
    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 20px;
      color: #2d3748;
      font-weight: 600;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e2e8f0;
      position: relative;
    }
    
    .section-title::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 80px;
      height: 2px;
      background: #4299e1;
    }
    
    /* Card Grid Layout */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s ease;
    }
    
    .card:hover {
      border-color: #cbd5e0;
      background: #edf2f7;
      transform: translateY(-2px);
    }
    
    .card-label {
      font-size: 14px;
      color: #718096;
      font-weight: 500;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .card-value {
      font-size: 24px;
      color: #2d3748;
      font-weight: 700;
      margin-bottom: 6px;
    }
    
    .card-note {
      font-size: 13px;
      color: #a0aec0;
      font-style: italic;
    }
    
    /* Status Badges */
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-left: 8px;
    }
    
    .status-badge.normal {
      background: #c6f6d5;
      color: #22543d;
    }
    
    .status-badge.elevated {
      background: #fed7d7;
      color: #9b2c2c;
    }
    
    .status-badge.high {
      background: #fed7d7;
      color: #9b2c2c;
    }
    
    .status-badge.low {
      background: #fed7d7;
      color: #9b2c2c;
    }
    
    .status-badge.borderline {
      background: #feebc8;
      color: #744210;
    }
    
    /* Table Styles */
    .table-container {
      overflow-x: auto;
      margin-bottom: 30px;
    }
    
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    
    th {
      background: #4299e1;
      color: white;
      font-weight: 600;
      text-align: left;
      padding: 16px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    td {
      padding: 16px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 15px;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    tr:hover {
      background: #f8fafc;
    }
    
    /* ECG Image Section */
    .ecg-section {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .ecg-image-container {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .ecg-image {
      max-width: 100%;
      height: auto;
      max-height: 400px;
      object-fit: contain;
      border-radius: 8px;
    }
    
    .ecg-caption {
      font-size: 14px;
      color: #718096;
      margin-top: 10px;
      font-style: italic;
    }
    
    /* AI Analysis Results */
    .analysis-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 30px;
    }
    
    .analysis-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      text-align: center;
    }
    
    .analysis-label {
      font-size: 13px;
      color: #718096;
      font-weight: 500;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .analysis-value {
      font-size: 20px;
      color: #2d3748;
      font-weight: 700;
    }
    
    .interpretation-box {
      background: #f0fff4;
      border: 1px solid #c6f6d5;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 30px;
    }
    
    .interpretation-title {
      font-size: 16px;
      color: #22543d;
      font-weight: 600;
      margin-bottom: 10px;
    }
    
    .interpretation-text {
      font-size: 14px;
      color: #22543d;
      line-height: 1.6;
    }
    
    /* Lifestyle Section */
    .lifestyle-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
    }
    
    .lifestyle-tag {
      background: #e2e8f0;
      color: #4a5568;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
    }
    
    /* Footer and Disclaimer */
    .report-footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid #e2e8f0;
    }
    
    .disclaimer {
      background: #fffaf0;
      border: 1px solid #fed7aa;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 30px;
    }
    
    .disclaimer-title {
      font-size: 16px;
      color: #9c4221;
      font-weight: 600;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .disclaimer-text {
      font-size: 14px;
      color: #9c4221;
      line-height: 1.6;
    }
    
    .footer-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: #a0aec0;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }
    
    .footer-brand {
      font-size: 16px;
      color: #2d3748;
      font-weight: 600;
    }
    
    /* Print Styles */
    @media print {
      body {
        padding: 20px;
      }
      
      .card:hover {
        transform: none;
        border-color: #e2e8f0;
      }
      
      .no-print {
        display: none;
      }
      
      .page-break {
        page-break-before: always;
      }
    }
    
    /* Utility Classes */
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .mb-20 { margin-bottom: 20px; }
    .mt-20 { margin-top: 20px; }
    .mb-30 { margin-bottom: 30px; }
    .mt-30 { margin-top: 30px; }
  </style>
</head>
<body>

<div class="report-header">
  <h1 class="portal-title">HeartBuddy</h1>
  <h2 class="report-title">Patient Health Report</h2>
  <p class="report-subtitle">AI-Powered ECG Analysis</p>
</div>

<div class="report-meta">
  <div class="meta-item">
    <div class="meta-label">Report Date</div>
    <div class="meta-value">${formatDate(new Date())}</div>
  </div>
  <div class="meta-item">
    <div class="meta-label">Report ID</div>
    <div class="meta-value">HB-${Date.now().toString().slice(-8)}</div>
  </div>
  <div class="meta-item">
    <div class="meta-label">Generated By</div>
    <div class="meta-value">HeartBuddy AI System</div>
  </div>
</div>

<!-- Patient Information Section -->
<div class="section">
  <h3 class="section-title">Patient Information</h3>
  <div class="card-grid">
    <div class="card">
      <div class="card-label">Full Name</div>
      <div class="card-value">${data.patient?.name || 'N/A'}</div>
    </div>
    <div class="card">
      <div class="card-label">Age</div>
      <div class="card-value">${data.patient?.age || 'N/A'} years</div>
    </div>
    <div class="card">
      <div class="card-label">Gender</div>
      <div class="card-value">${data.patient?.gender ? data.patient.gender.charAt(0).toUpperCase() + data.patient.gender.slice(1) : 'N/A'}</div>
    </div>
  </div>
</div>

<!-- Health Metrics Section -->
<div class="section">
  <h3 class="section-title">Health Metrics</h3>
  <div class="card-grid">
    <div class="card">
      <div class="card-label">Blood Pressure</div>
      <div class="card-value">${formatBP(data.healthMetrics?.bp)}</div>
      <div class="card-note">Normal: 120/80 mmHg</div>
    </div>
    <div class="card">
      <div class="card-label">Oxygen Saturation (SpO₂)</div>
      <div class="card-value">${data.healthMetrics?.spo2 || 'N/A'}%</div>
      <div class="card-note">Normal: 95-100%</div>
    </div>
    <div class="card">
      <div class="card-label">Blood Sugar</div>
      <div class="card-value">${data.healthMetrics?.sugar || 'N/A'} mg/dL</div>
      <div class="card-note">Fasting normal: 70-100 mg/dL</div>
    </div>
    <div class="card">
      <div class="card-label">Total Cholesterol</div>
      <div class="card-value">${data.healthMetrics?.cholesterol || 'N/A'} mg/dL</div>
      <div class="card-note">Desirable: &lt;200 mg/dL</div>
    </div>
  </div>
</div>

<!-- Lipid Profile Section -->
<div class="section">
  <h3 class="section-title">Lipid Profile</h3>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Value</th>
          <th>Optimal Range</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>LDL Cholesterol</td>
          <td>${data.lipidProfile?.ldl || 'N/A'} mg/dL</td>
          <td>&lt;100 mg/dL</td>
          <td>
            <span class="status-badge ${data.lipidProfile?.ldl ? (parseInt(data.lipidProfile.ldl) < 100 ? 'normal' : 'high') : 'normal'}">
              ${data.lipidProfile?.ldl ? (parseInt(data.lipidProfile.ldl) < 100 ? 'Optimal' : 'High') : 'N/A'}
            </span>
          </td>
        </tr>
        <tr>
          <td>HDL Cholesterol</td>
          <td>${data.lipidProfile?.hdl || 'N/A'} mg/dL</td>
          <td>&gt;60 mg/dL</td>
          <td>
            <span class="status-badge ${data.lipidProfile?.hdl ? (parseInt(data.lipidProfile.hdl) > 60 ? 'normal' : 'low') : 'normal'}">
              ${data.lipidProfile?.hdl ? (parseInt(data.lipidProfile.hdl) > 60 ? 'Optimal' : 'Low') : 'N/A'}
            </span>
          </td>
        </tr>
        <tr>
          <td>Triglycerides</td>
          <td>${data.lipidProfile?.triglycerides || 'N/A'} mg/dL</td>
          <td>&lt;150 mg/dL</td>
          <td>
            <span class="status-badge ${data.lipidProfile?.triglycerides ? (parseInt(data.lipidProfile.triglycerides) < 150 ? 'normal' : 'high') : 'normal'}">
              ${data.lipidProfile?.triglycerides ? (parseInt(data.lipidProfile.triglycerides) < 150 ? 'Normal' : 'High') : 'N/A'}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<!-- Lifestyle Section -->
<div class="section">
  <h3 class="section-title">Lifestyle Habits</h3>
  <div class="lifestyle-tags">
    ${(data.lifestyle || []).length > 0
      ? data.lifestyle.map(habit => `<span class="lifestyle-tag">${habit}</span>`).join('')
      : '<span class="lifestyle-tag">No habits reported</span>'
    }
  </div>
</div>

<!-- ECG Analysis Section -->
<div class="section">
  <h3 class="section-title">ECG Analysis</h3>
  
  <!-- ECG Image -->
  ${data.ecgImagePath ? `
  <div class="ecg-section">
    <div class="ecg-image-container">
      <img 
        src="file://${process.cwd()}/${data.ecgImagePath.replace(/\\/g, '/')}"
        alt="ECG Image"
        class="ecg-image"
      />
      <p class="ecg-caption">Uploaded ECG image for analysis</p>
    </div>
  </div>
  ` : ''}

  
  <!-- AI Analysis Results -->
  ${data.aiAnalysis ? `
  <div class="section">
    <h4 class="section-title" style="font-size: 18px;">AI Analysis Results</h4>
    <div class="analysis-grid">
      <div class="analysis-card">
        <div class="analysis-label">Rhythm</div>
        <div class="analysis-value">${data.aiAnalysis.rhythm || 'N/A'}</div>
      </div>
      <div class="analysis-card">
        <div class="analysis-label">Heart Rate</div>
        <div class="analysis-value">${data.aiAnalysis.heartRate || 'N/A'} bpm</div>
      </div>
      <div class="analysis-card">
        <div class="analysis-label">PR Interval</div>
        <div class="analysis-value">${data.aiAnalysis.prInterval || 'N/A'} ms</div>
      </div>
      <div class="analysis-card">
        <div class="analysis-label">QRS Duration</div>
        <div class="analysis-value">${data.aiAnalysis.qrsDuration || 'N/A'} ms</div>
      </div>
      <div class="analysis-card">
        <div class="analysis-label">QT Interval</div>
        <div class="analysis-value">${data.aiAnalysis.qtInterval || 'N/A'} ms</div>
      </div>
      <div class="analysis-card">
        <div class="analysis-label">Axis</div>
        <div class="analysis-value">${data.aiAnalysis.axis || 'N/A'}</div>
      </div>
    </div>
    
    <div class="interpretation-box">
      <div class="interpretation-title">AI Interpretation</div>
      <div class="interpretation-text">${data.aiAnalysis.interpretation || 'No interpretation available.'}</div>
    </div>
    
    ${data.aiAnalysis.abnormalities && data.aiAnalysis.abnormalities.length > 0 ? `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Abnormalities Detected</th>
            <th>Severity</th>
          </tr>
        </thead>
        <tbody>
          ${data.aiAnalysis.abnormalities.map(ab => `
            <tr>
              <td>${ab}</td>
              <td><span class="status-badge elevated">Requires Review</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : `
    <div class="interpretation-box" style="background: #f0fff4; border-color: #c6f6d5;">
      <div class="interpretation-title">Abnormalities</div>
      <div class="interpretation-text">No significant abnormalities detected in the ECG analysis.</div>
    </div>
    `}
  </div>
  ` : ''}
</div>

<!-- Summary Section -->
<div class="section">
  <h3 class="section-title">Health Summary</h3>
  <div class="card">
    <div style="font-size: 14px; color: #4a5568; line-height: 1.6;">
      <p>Based on the provided health metrics and ECG analysis:</p>
      <ul style="margin-top: 10px; margin-left: 20px;">
        <li>All health parameters are within normal ranges</li>
        <li>ECG shows normal sinus rhythm with regular intervals</li>
        <li>No significant abnormalities detected in the analysis</li>
        <li>Lifestyle factors have been recorded for comprehensive assessment</li>
      </ul>
      <p style="margin-top: 15px; font-weight: 600; color: #2d3748;">
        Recommendation: Continue regular health monitoring and maintain current lifestyle practices.
      </p>
    </div>
  </div>
</div>

<!-- Footer and Disclaimer -->
<div class="report-footer">
  <div class="disclaimer">
    <div class="disclaimer-title">⚠️ Medical Disclaimer</div>
    <div class="disclaimer-text">
      This report is generated by HeartBuddy AI System for educational and informational purposes only. 
      It is not intended to replace professional medical advice, diagnosis, or treatment. 
      Always consult a qualified healthcare provider for medical concerns. 
      ECG analysis results should be verified by a licensed cardiologist. 
      The accuracy of AI-generated interpretations may vary and should be confirmed by medical professionals.
    </div>
  </div>
  
  <div class="footer-meta">
    <div class="footer-brand">HeartBuddy AI Health Portal</div>
    <div>
      <div>Generated on: ${formatDate(new Date())}</div>
      <div>Report ID: HB-${Date.now().toString().slice(-8)}</div>
    </div>
  </div>
</div>

</body>
</html>
`;
};