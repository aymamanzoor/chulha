import express from "express";
import {
  getComments,
  createComment,
  toggleLikeComment,
  deleteComment,
} from "../controllers/comments.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", optionalAuth, getComments);
router.post("/", authenticate, createComment);
router.post("/:id/like", authenticate, toggleLikeComment);
router.delete("/:id", authenticate, deleteComment);

export default router;
