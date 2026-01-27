import express from "express";
import corsMiddleware from "./middleware/cors.middleware.js";
import { rateLimit } from "./middleware/rateLimit.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import reportRoutes from "./routes/report.routes.js";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use(rateLimit(100, 60000));

app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api/auth", rateLimit(10, 60000), authRoutes);
app.use("/api/report", reportRoutes);

export default app;
