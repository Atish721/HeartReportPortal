import fs from "fs";
import path from "path";

export const saveBase64Image = (base64Data) => {
  const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid image format");

  const ext = matches[1];
  const buffer = Buffer.from(matches[2], "base64");

  const fileName = `ecg_${Date.now()}.${ext}`;
  const uploadPath = path.join("uploads", "ecg", fileName);

  fs.writeFileSync(uploadPath, buffer);

  return uploadPath;
};
