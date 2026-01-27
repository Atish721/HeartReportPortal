import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true }
});

export default mongoose.model("Admin", adminSchema);
