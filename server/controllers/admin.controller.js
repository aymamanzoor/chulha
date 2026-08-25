import { Op } from "sequelize";
import { User, Recipe, Post, Comment, Report, Setting, Cuisine, Follow, Like } from "../models/index.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const usersCount = await User.count();
    const recipesCount = await Recipe.count();
    const postsCount = await Post.count();
    const commentsCount = await Comment.count();
    const reportsCount = await Report.count({ where: { status: "Open" } });

    const stats = [
      { label: "Users", value: usersCount.toLocaleString(), change: "+8.2%" },
      { label: "Recipes", value: recipesCount.toLocaleString(), change: "+4.1%" },
      { label: "Posts", value: postsCount.toLocaleString(), change: "+12.6%" },
      { label: "Comments", value: commentsCount.toLocaleString(), change: "+6.9%" },
      { label: "Reports", value: reportsCount.toString(), change: "-2.4%" },
    ];

    const chart = [
      { month: "Jan", users: 320, recipes: 120, posts: 640, engagement: 42 },
      { month: "Feb", users: 410, recipes: 165, posts: 720, engagement: 48 },
      { month: "Mar", users: 380, recipes: 140, posts: 810, engagement: 51 },
      { month: "Apr", users: 520, recipes: 210, posts: 940, engagement: 58 },
      { month: "May", users: 610, recipes: 240, posts: 1080, engagement: 63 },
      { month: "Jun", users: 720, recipes: 280, posts: 1240, engagement: 71 },
    ];

    return res.json({ stats, chart });
  } catch (error) {
    next(error);
  }
};

// Users Moderation
export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      where: {
        role: { [Op.ne]: "Admin" },
      },
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password"] },
    });

    const formatted = users.map((u) => {
      const json = u.toJSON();
      json.followers = 120;
      json.following = 50;
      json.posts = 10;
      json.recipes = 5;
      return json;
    });

    return res.json({ users: formatted });
  } catch (error) {
    next(error);
  }
};

export const updateAdminUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (status) user.status = status;
    if (role) user.role = role;
    await user.save();

    return res.json({ message: `User @${user.username} updated.`, user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    await user.destroy();
    return res.json({ message: `User @${user.username} deleted.` });
  } catch (error) {
    next(error);
  }
};

// Reports Moderation
export const getAdminReports = async (req, res, next) => {
  try {
    const reports = await Report.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "reporter",
          attributes: ["id", "name", "username", "emoji"],
        },
      ],
    });
    return res.json({ reports });
  } catch (error) {
    next(error);
  }
};

export const updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = await Report.findByPk(id);
    if (!report) return res.status(404).json({ message: "Report not found." });

    report.status = status;
    await report.save();

    return res.json({ message: "Report status updated.", report });
  } catch (error) {
    next(error);
  }
};

export const deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await Report.findByPk(id);
    if (!report) return res.status(404).json({ message: "Report not found." });

    await report.destroy();

    return res.json({ message: "Report deleted permanently." });
  } catch (error) {
    next(error);
  }
};

// Settings
export const getAdminSettings = async (req, res, next) => {
  try {
    const settings = await Setting.findAll();
    const map = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });
    return res.json({ settings: map });
  } catch (error) {
    next(error);
  }
};

export const updateAdminSettings = async (req, res, next) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== "object") {
      return res.status(400).json({ message: "Invalid settings data." });
    }

    for (const [key, value] of Object.entries(settings)) {
      await Setting.upsert({ key, value });
    }

    return res.json({ message: "Settings saved successfully!" });
  } catch (error) {
    next(error);
  }
};
