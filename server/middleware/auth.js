import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required. Please log in." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "chulha_jwt_super_secret_key_2026");

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found or account deleted." });
    }

    if (user.status === "Suspended") {
      return res.status(403).json({ message: "Your account has been suspended." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "chulha_jwt_super_secret_key_2026");
      const user = await User.findByPk(decoded.id);
      if (user && user.status !== "Suspended") {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore invalid token in optional auth
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== "Admin" && req.user.role !== "Moderator")) {
    return res.status(403).json({ message: "Access denied. Admin or Moderator privileges required." });
  }
  next();
};
