import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

import { sequelize } from "./models/index.js";
import { testConnection } from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import recipesRoutes from "./routes/recipes.routes.js";
import postsRoutes from "./routes/posts.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import cuisinesRoutes from "./routes/cuisines.routes.js";
import usersRoutes from "./routes/users.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.resolve(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Static upload files serving
app.use("/uploads", express.static(uploadsDir));

// Root API Welcome / Directory endpoint
app.get("/api", (req, res) => {
  res.json({
    status: "ok",
    name: "Chulha API",
    version: "1.0.0",
    message: "Chulha PostgreSQL & Sequelize Backend API is running!",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      recipes: "/api/recipes",
      posts: "/api/posts",
      comments: "/api/comments",
      cuisines: "/api/cuisines",
      users: "/api/users",
      notifications: "/api/notifications",
      admin: "/api/admin",
    },
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Chulha API is running with Sequelize & PostgreSQL!",
    timestamp: new Date(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/cuisines", cuisinesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// Serve static React files in production
const distPath = path.resolve(__dirname, "..", "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // Client-side routing fallback
  app.get("*", (req, res, next) => {
    if (!req.url.startsWith("/api")) {
      return res.sendFile(path.join(distPath, "index.html"));
    }
    next();
  });
}

// Global Error Handler
app.use(errorHandler);

// Start Server & Sync Database
const startServer = async () => {
  try {
    const connected = await testConnection();
    if (connected) {
      // Sync models without dropping tables in normal runs
      await sequelize.sync({ alter: false });
      console.log("🗄️  Sequelize models synchronized with PostgreSQL.");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Chulha Backend Server running on http://localhost:${PORT}`);
      console.log(`📡 API Endpoints available at http://localhost:${PORT}/api/`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
