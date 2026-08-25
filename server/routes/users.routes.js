import express from "express";
import {
  getProfile,
  toggleFollowUser,
  updateProfile,
  getSuggestedUsers,
} from "../controllers/users.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/suggested", optionalAuth, getSuggestedUsers);
router.get("/profile/:username", optionalAuth, getProfile);
router.post("/:id/follow", authenticate, toggleFollowUser);
router.put("/profile", authenticate, updateProfile);

export default router;
