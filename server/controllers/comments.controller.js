import { Op } from "sequelize";
import { Comment, User, Like, Notification, Post, Recipe } from "../models/index.js";

const isUUID = (str) => {
  return typeof str === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

export const getComments = async (req, res, next) => {
  try {
    const { postId, recipeId, slug } = req.query;

    let targetRecipeId = recipeId === "undefined" || recipeId === "null" ? null : recipeId;
    if (targetRecipeId && !isUUID(targetRecipeId)) {
      const recipe = await Recipe.findOne({ where: { slug: targetRecipeId } });
      targetRecipeId = recipe ? recipe.id : null;
    }

    if (!targetRecipeId && slug && slug !== "undefined" && slug !== "null") {
      const recipe = await Recipe.findOne({ where: { slug } });
      targetRecipeId = recipe ? recipe.id : null;
    }

    let targetPostId = postId === "undefined" || postId === "null" ? null : postId;
    if (targetPostId && !isUUID(targetPostId)) {
      const post = await Post.findByPk(targetPostId);
      targetPostId = post ? post.id : null;
    }

    let targetParentId = req.query.parentId === "undefined" || req.query.parentId === "null" ? null : req.query.parentId;

    const where = { parentId: null };
    if (targetPostId) where.postId = targetPostId;
    if (targetRecipeId) where.recipeId = targetRecipeId;

    const comments = await Comment.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "username", "emoji"],
        },
        {
          model: Comment,
          as: "replies",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "username", "emoji"],
            },
          ],
        },
      ],
    });

    const userId = req.user?.id;
    const formatted = await Promise.all(
      comments.map(async (c) => {
        const json = c.toJSON();
        json.likes = await Like.count({ where: { targetType: "comment", targetId: c.id } });
        json.time = "Just now";

        if (userId) {
          const isLiked = await Like.findOne({ where: { userId, targetType: "comment", targetId: c.id } });
          json.isLiked = !!isLiked;
        }

        if (json.replies && json.replies.length > 0) {
          json.replies = await Promise.all(
            json.replies.map(async (rep) => {
              rep.likes = await Like.count({ where: { targetType: "comment", targetId: rep.id } });
              rep.time = "Just now";
              if (userId) {
                const isRepLiked = await Like.findOne({ where: { userId, targetType: "comment", targetId: rep.id } });
                rep.isLiked = !!isRepLiked;
              }
              return rep;
            })
          );
        }

        return json;
      })
    );

    return res.json({ comments: formatted });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { postId, recipeId, slug, parentId, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text cannot be empty." });
    }

    let targetRecipeId = recipeId === "undefined" || recipeId === "null" ? null : recipeId;
    if (targetRecipeId && !isUUID(targetRecipeId)) {
      const recipe = await Recipe.findOne({ where: { slug: targetRecipeId } });
      targetRecipeId = recipe ? recipe.id : null;
    }

    if (!targetRecipeId && slug && slug !== "undefined" && slug !== "null") {
      const recipe = await Recipe.findOne({ where: { slug } });
      targetRecipeId = recipe ? recipe.id : null;
    }

    let targetPostId = postId === "undefined" || postId === "null" ? null : postId;
    if (targetPostId && !isUUID(targetPostId)) {
      const post = await Post.findByPk(targetPostId);
      targetPostId = post ? post.id : null;
    }

    let targetParentId = parentId === "undefined" || parentId === "null" ? null : parentId;
    if (targetParentId && !isUUID(targetParentId)) {
      targetParentId = null;
    }

    const comment = await Comment.create({
      userId: req.user.id,
      postId: targetPostId || null,
      recipeId: targetRecipeId || null,
      parentId: targetParentId || null,
      text: text.trim(),
    });

    if (targetPostId) {
      const post = await Post.findByPk(targetPostId);
      if (post && post.userId !== req.user.id) {
        await Notification.create({
          recipientId: post.userId,
          senderId: req.user.id,
          action: `commented: "${text.slice(0, 30)}..."`,
          type: "comment",
        });
      }
    } else if (targetRecipeId) {
      const recipe = await Recipe.findByPk(targetRecipeId);
      if (recipe && recipe.creatorId !== req.user.id) {
        await Notification.create({
          recipientId: recipe.creatorId,
          senderId: req.user.id,
          action: `commented on your recipe "${recipe.title}"`,
          type: "comment",
        });
      }
    }

    const populated = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "username", "emoji"],
        },
      ],
    });

    const json = populated.toJSON();
    json.likes = 0;
    json.time = "Just now";
    json.replies = [];

    return res.status(201).json({
      message: "Comment added!",
      comment: json,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleLikeComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!isUUID(id)) {
      return res.json({ isLiked: true, likesCount: 1 });
    }

    const existing = await Like.findOne({
      where: { userId, targetType: "comment", targetId: id },
    });

    if (existing) {
      await existing.destroy();
      const likesCount = await Like.count({ where: { targetType: "comment", targetId: id } });
      return res.json({ isLiked: false, likesCount });
    } else {
      await Like.create({ userId, targetType: "comment", targetId: id });
      const likesCount = await Like.count({ where: { targetType: "comment", targetId: id } });
      return res.json({ isLiked: true, likesCount });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isUUID(id)) {
      return res.json({ message: "Comment deleted." });
    }

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    if (comment.userId !== req.user.id && req.user.role !== "Admin" && req.user.role !== "Moderator") {
      return res.status(403).json({ message: "Not authorized to delete this comment." });
    }

    await comment.destroy();
    return res.json({ message: "Comment deleted successfully." });
  } catch (error) {
    next(error);
  }
};
