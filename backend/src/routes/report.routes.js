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
  let ecgImagePath;
  let pdfPath;

  try {
    const {
      patient,
      healthMetrics,
      lipidProfile,
      lifestyle,
      ecgImageBase64
    } = req.body;

    // 1️⃣ Save ECG image
    ecgImagePath = saveBase64Image(ecgImageBase64);

    // 2️⃣ Save report in DB
    const report = await PatientReport.create({
      patient,
      healthMetrics,
      lipidProfile,
      lifestyle,
      ecgImagePath
    });

    // 3️⃣ Generate PDF
    const html = generateReportHTML(report);
    pdfPath = generatePDF(html);

    if (!fs.existsSync(pdfPath)) {
      throw new Error("PDF generation failed");
    }

    // 4️⃣ Send PDF to client
    res.download(pdfPath, "Patient_ECG_Report.pdf");

    // 5️⃣ CLEANUP AFTER RESPONSE
    res.on("finish", () => {
      // delete PDF
      if (pdfPath && fs.existsSync(pdfPath)) {
        fs.unlink(pdfPath, () => { });
      }

      // delete ECG image
      if (ecgImagePath && fs.existsSync(ecgImagePath)) {
        fs.unlink(ecgImagePath, () => { });
      }
    });

  } catch (err) {
    console.error("PDF ERROR:", err);

    // cleanup if error happens
    if (pdfPath && fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    if (ecgImagePath && fs.existsSync(ecgImagePath)) {
      fs.unlinkSync(ecgImagePath);
    }

    res.status(500).json({ message: "PDF generation failed" });
  }
});


export default router;
