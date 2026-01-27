import express from "express";
import authRoutes from "./routes/auth.routes.js";
import reportRoutes from "./routes/report.routes.js";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/report", reportRoutes);

export default app;
