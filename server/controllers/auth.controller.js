import jwt from "jsonwebtoken";
import { User, Recipe, Post, Follow } from "../models/index.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET || "chulha_jwt_super_secret_key_2026",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

export const register = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: "Username is already taken." });
    }

    const user = await User.create({
      name,
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: "Account created successfully!",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (user.status === "Suspended") {
      return res.status(403).json({ message: "Your account is suspended. Contact admin." });
    }

    const token = generateToken(user);

    return res.json({
      message: "Logged in successfully!",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: Recipe, as: "recipes", attributes: ["id"] },
        { model: Post, as: "posts", attributes: ["id"] },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const followersCount = await Follow.count({ where: { followingId: user.id } });
    const followingCount = await Follow.count({ where: { followerId: user.id } });

    const safe = user.toSafeObject();
    safe.followers = followersCount;
    safe.following = followingCount;
    safe.recipesCount = user.recipes ? user.recipes.length : 0;
    safe.postsCount = user.posts ? user.posts.length : 0;

    return res.json({ user: safe });
  } catch (error) {
    next(error);
  }
};
