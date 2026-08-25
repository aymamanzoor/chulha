import express from "express";
import {
  getNotifications,
  markNotificationsRead,
} from "../controllers/notifications.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, getNotifications);
router.put("/read-all", authenticate, markNotificationsRead);

export default router;
