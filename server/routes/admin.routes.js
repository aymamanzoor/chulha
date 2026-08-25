import express from "express";
import {
  getDashboardStats,
  getAdminUsers,
  updateAdminUserStatus,
  deleteAdminUser,
  getAdminReports,
  updateReportStatus,
  deleteReport,
  getAdminSettings,
  updateAdminSettings,
} from "../controllers/admin.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Apply auth + requireAdmin to all admin endpoints
router.use(authenticate, requireAdmin);

router.get("/stats", getDashboardStats);
router.get("/users", getAdminUsers);
router.put("/users/:id", updateAdminUserStatus);
router.delete("/users/:id", deleteAdminUser);

router.get("/reports", getAdminReports);
router.put("/reports/:id", updateReportStatus);
router.delete("/reports/:id", deleteReport);

router.get("/settings", getAdminSettings);
router.put("/settings", updateAdminSettings);

export default router;
