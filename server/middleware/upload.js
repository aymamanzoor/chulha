import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const _dirname = path.resolve(process.cwd(), "server", "middleware");
const uploadDir = path.resolve(_dirname, "../uploads");

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn("Could not create uploads directory in middleware:", err.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `dish-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const isExtValid = allowed.test(path.extname(file.originalname).toLowerCase());
  const isMimeValid = allowed.test(file.mimetype);

  if (isExtValid && isMimeValid) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPG, PNG, WEBP, GIF) are allowed!"));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
});
