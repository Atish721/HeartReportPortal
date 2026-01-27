import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { ENV } from "./src/config/env.js";

connectDB();
app.listen(ENV.PORT, () =>
  console.log(`🚀 Backend running on port ${ENV.PORT}`)
);
