import express from "express";
import {
  getRecipes,
  getRecipeBySlug,
  createRecipe,
  updateRecipeStatus,
  deleteRecipe,
  toggleLikeRecipe,
  toggleSaveRecipe,
} from "../controllers/recipes.controller.js";
import { authenticate, optionalAuth, requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", optionalAuth, getRecipes);
router.get("/:slug", optionalAuth, getRecipeBySlug);
router.post("/", authenticate, upload.single("imageFile"), createRecipe);
router.put("/:id/status", authenticate, requireAdmin, updateRecipeStatus);
router.delete("/:id", authenticate, deleteRecipe);
router.post("/:id/like", authenticate, toggleLikeRecipe);
router.post("/:id/save", authenticate, toggleSaveRecipe);

export default router;
