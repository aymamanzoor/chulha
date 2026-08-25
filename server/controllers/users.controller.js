import { Op } from "sequelize";
import { User, Recipe, Post, Follow, SavedItem, Notification, Like } from "../models/index.js";

export const getProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({
      where: { username: username.toLowerCase().trim() },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const followersCount = await Follow.count({ where: { followingId: user.id } });
    const followingCount = await Follow.count({ where: { followerId: user.id } });
    const recipesCount = await Recipe.count({ where: { creatorId: user.id, status: "Approved" } });
    const postsCount = await Post.count({ where: { userId: user.id } });

    // Fetch user recipes
    const recipes = await Recipe.findAll({
      where: { creatorId: user.id, status: "Approved" },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "username", "emoji"],
        },
      ],
    });

    // Fetch user posts
    const posts = await Post.findAll({
      where: { userId: user.id },
      order: [["createdAt", "DESC"]],
    });

    // Fetch saved recipes
    const savedRecords = await SavedItem.findAll({
      where: { userId: user.id, targetType: "recipe" },
      attributes: ["targetId"],
    });
    const savedRecipeIds = savedRecords.map((s) => s.targetId);

    const savedRecipes = await Recipe.findAll({
      where: { id: savedRecipeIds },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "username", "emoji"],
        },
      ],
    });

    // Check if current user is following this user
    let isFollowing = false;
    if (req.user) {
      const follow = await Follow.findOne({
        where: { followerId: req.user.id, followingId: user.id },
      });
      isFollowing = !!follow;
    }

    const json = user.toJSON();
    json.followers = followersCount;
    json.following = followingCount;
    json.recipesCount = recipesCount;
    json.postsCount = postsCount;
    json.isFollowing = isFollowing;

    return res.json({
      user: json,
      recipes,
      posts,
      savedRecipes,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFollowUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    if (id === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    const targetUser = await User.findByPk(id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const existing = await Follow.findOne({
      where: { followerId: currentUserId, followingId: id },
    });

    if (existing) {
      await existing.destroy();
      const followersCount = await Follow.count({ where: { followingId: id } });
      return res.json({ message: `Unfollowed @${targetUser.username}`, isFollowing: false, followersCount });
    } else {
      await Follow.create({ followerId: currentUserId, followingId: id });
      await Notification.create({
        recipientId: id,
        senderId: currentUserId,
        action: "started following you",
        type: "follow",
      });
      const followersCount = await Follow.count({ where: { followingId: id } });
      return res.json({ message: `Following @${targetUser.username}`, isFollowing: true, followersCount });
    }
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, emoji } = req.body;
    const user = await User.findByPk(req.user.id);

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (emoji) user.emoji = emoji;

    await user.save();

    return res.json({
      message: "Profile updated successfully!",
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

export const getSuggestedUsers = async (req, res, next) => {
  try {
    const whereClause = { status: "Active" };
    if (req.user) {
      whereClause.id = { [Op.ne]: req.user.id };
    }

    const users = await User.findAll({
      limit: 6,
      where: whereClause,
      attributes: ["id", "name", "username", "emoji", "bio"],
    });

    const formatted = await Promise.all(
      users.map(async (u) => {
        const json = u.toJSON();
        json.followers = await Follow.count({ where: { followingId: u.id } });
        if (req.user) {
          const isFollowing = await Follow.findOne({
            where: { followerId: req.user.id, followingId: u.id },
          });
          json.isFollowing = !!isFollowing;
        } else {
          json.isFollowing = false;
        }
        return json;
      })
    );

    return res.json({ users: formatted });
  } catch (error) {
    next(error);
  }
};
