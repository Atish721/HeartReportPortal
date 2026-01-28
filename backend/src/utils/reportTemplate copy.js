import path from "path";

export const generateReportHTML = (data) => {

  const absoluteImagePath = path.resolve(data.ecgImagePath).replace(/\\/g, "/");

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial; padding: 30px; }
    h1 { color: #0d6efd; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    img { width: 100%; max-height: 300px; object-fit: contain; }
    .disclaimer { background: #fff3cd; padding: 10px; margin-top: 20px; }
  </style>
</head>
<body>

<h1>HeartBuddy – ECG Report</h1>

<h3>Patient Information</h3>
<table>
<tr><th>Name</th><td>${data.patient.name}</td></tr>
<tr><th>Age</th><td>${data.patient.age}</td></tr>
<tr><th>Gender</th><td>${data.patient.gender}</td></tr>
</table>

<h3>Health Metrics</h3>
<table>
<tr><th>BP</th><td>${data.healthMetrics.bp}</td></tr>
<tr><th>SpO₂</th><td>${data.healthMetrics.spo2}%</td></tr>
<tr><th>Sugar</th><td>${data.healthMetrics.sugar}</td></tr>
<tr><th>Cholesterol</th><td>${data.healthMetrics.cholesterol}</td></tr>
</table>

<h3>Lipid Profile</h3>
<table>
<tr><th>LDL</th><td>${data.lipidProfile.ldl}</td></tr>
<tr><th>HDL</th><td>${data.lipidProfile.hdl}</td></tr>
<tr><th>Triglycerides</th><td>${data.lipidProfile.triglycerides}</td></tr>
</table>

<h3>Lifestyle</h3>
<p>${data.lifestyle.join(", ")}</p>

<h3>ECG Image</h3>
<img src="file:///${absoluteImagePath}" />

<div class="disclaimer">
<b>Medical Disclaimer:</b> This report is for informational purposes only.
</div>

</body>
</html>
`;
};
