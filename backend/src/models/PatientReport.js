import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  patient: {
    name: String,
    age: Number,
    gender: String
  },
  healthMetrics: {
    bp: String,
    spo2: Number,
    sugar: Number,
    cholesterol: Number
  },
  lipidProfile: {
    ldl: Number,
    hdl: Number,
    triglycerides: Number
  },
  lifestyle: [String],
  ecgImagePath: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("PatientReport", reportSchema);
