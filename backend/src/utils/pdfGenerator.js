import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export const generatePDF = (htmlContent) => {
  const time = Date.now();

  const uploadDir = path.resolve("uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const htmlPath = path.join(uploadDir, `report_${time}.html`);
  const pdfPath = path.join(uploadDir, `report_${time}.pdf`);

  fs.writeFileSync(htmlPath, htmlContent);

  const command = process.platform === "win32"
    ? `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless --disable-gpu --print-to-pdf="${pdfPath}" "${htmlPath}"`
    : `chromium --headless --no-sandbox --disable-gpu --print-to-pdf=${pdfPath} ${htmlPath}`;

  execSync(command, { stdio: "ignore" });

  fs.unlinkSync(htmlPath);

  return pdfPath;
};
