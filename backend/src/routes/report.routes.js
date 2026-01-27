import fs from "fs";
import path from "path";
import express from "express";
import PatientReport from "../models/PatientReport.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { saveBase64Image } from "../utils/fileUpload.js";
import { generateReportHTML } from "../utils/reportTemplate.js";
import { generatePDF } from "../utils/pdfGenerator.js";

const router = express.Router();

router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const {
      patient,
      healthMetrics,
      lipidProfile,
      lifestyle,
      ecgImageBase64
    } = req.body;

    const ecgImagePath = saveBase64Image(ecgImageBase64);

    const report = await PatientReport.create({
      patient,
      healthMetrics,
      lipidProfile,
      lifestyle,
      ecgImagePath
    });

    const html = generateReportHTML(report);
    const pdfPath = generatePDF(html);

    if (!fs.existsSync(pdfPath)) {
      return res.status(500).json({ message: "PDF generation failed" });
    }

    res.download(pdfPath, "Patient_ECG_Report.pdf");

    // ✅ SAFE CLEANUP (after response ends)
    res.on("finish", () => {
      if (fs.existsSync(pdfPath)) {
        fs.unlink(pdfPath, () => {});
      }
    });

  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ message: "PDF generation failed" });
  }
});

export default router;
