import express from "express";
import {
  getPosts,
  createPost,
  deletePost,
  toggleLikePost,
  toggleSavePost,
} from "../controllers/posts.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", optionalAuth, getPosts);
router.post("/", authenticate, upload.single("imageFile"), createPost);
router.delete("/:id", authenticate, deletePost);
router.post("/:id/like", authenticate, toggleLikePost);
router.post("/:id/save", authenticate, toggleSavePost);

export default router;
