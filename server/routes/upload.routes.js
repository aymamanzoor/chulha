import express from "express";
import { upload } from "../middleware/upload.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({
    message: "File uploaded successfully!",
    url: fileUrl,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
});

export default router;
