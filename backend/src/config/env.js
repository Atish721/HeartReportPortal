export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/heartbuddy",
  JWT_SECRET: process.env.JWT_SECRET || "super-secret-key",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@heartbuddy.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "Admin@123"
};
