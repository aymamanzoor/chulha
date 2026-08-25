import express from "express";
import {
  getCuisines,
  getCuisineBySlug,
  createCuisine,
  deleteCuisine,
} from "../controllers/cuisines.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getCuisines);
router.get("/:slug", getCuisineBySlug);
router.post("/", authenticate, requireAdmin, upload.single("imageFile"), createCuisine);
router.delete("/:id", authenticate, requireAdmin, deleteCuisine);

export default router;
