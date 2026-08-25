import { Post, User, Like, SavedItem, Comment } from "../models/index.js";

export const getPosts = async (req, res, next) => {
  try {
    const { limit = 30, offset = 0 } = req.query;

    const userInclude = {
      model: User,
      as: "user",
      attributes: ["id", "name", "username", "emoji", "bio"],
    };

    if (!req.user || (req.user.role !== "Admin" && req.user.role !== "Moderator")) {
      userInclude.where = { status: "Active" };
    }

    const { count, rows: posts } = await Post.findAndCountAll({
      limit: Number(limit),
      offset: Number(offset),
      order: [["createdAt", "DESC"]],
      include: [userInclude],
    });

    const userId = req.user?.id;
    const formatted = await Promise.all(
      posts.map(async (p) => {
        const json = p.toJSON();
        json.likes = await Like.count({ where: { targetType: "post", targetId: p.id } });
        json.commentCount = await Comment.count({ where: { postId: p.id } });

        if (userId) {
          const isLiked = await Like.findOne({ where: { userId, targetType: "post", targetId: p.id } });
          const isSaved = await SavedItem.findOne({ where: { userId, targetType: "post", targetId: p.id } });
          json.isLiked = !!isLiked;
          json.isSaved = !!isSaved;
        } else {
          json.isLiked = false;
          json.isSaved = false;
        }

        json.time = "Just now";
        return json;
      })
    );

    return res.json({ total: count, posts: formatted });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { kind = "Food Post", text, recipeSlug, image } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Post content / caption is required." });
    }

    const post = await Post.create({
      userId: req.user.id,
      kind,
      text,
      image: image || (req.file ? `/uploads/${req.file.filename}` : null),
      recipeSlug: recipeSlug || null,
    });

    const populated = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "username", "emoji", "bio"],
        },
      ],
    });

    const json = populated.toJSON();
    json.likes = 0;
    json.commentCount = 0;
    json.isLiked = false;
    json.isSaved = false;

    return res.status(201).json({
      message: "Post created successfully!",
      post: json,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.userId !== req.user.id && req.user.role !== "Admin" && req.user.role !== "Moderator") {
      return res.status(403).json({ message: "Not authorized to delete this post." });
    }

    await post.destroy();
    return res.json({ message: "Post removed successfully." });
  } catch (error) {
    next(error);
  }
};

export const toggleLikePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const existing = await Like.findOne({
      where: { userId, targetType: "post", targetId: id },
    });

    if (existing) {
      await existing.destroy();
      const likesCount = await Like.count({ where: { targetType: "post", targetId: id } });
      return res.json({ message: "Unliked post", isLiked: false, likesCount });
    } else {
      await Like.create({ userId, targetType: "post", targetId: id });
      const likesCount = await Like.count({ where: { targetType: "post", targetId: id } });
      return res.json({ message: "Liked post", isLiked: true, likesCount });
    }
  } catch (error) {
    next(error);
  }
};

export const toggleSavePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const existing = await SavedItem.findOne({
      where: { userId, targetType: "post", targetId: id },
    });

    if (existing) {
      await existing.destroy();
      return res.json({ message: "Post removed from saved", isSaved: false });
    } else {
      await SavedItem.create({ userId, targetType: "post", targetId: id });
      return res.json({ message: "Post saved to collection", isSaved: true });
    }
  } catch (error) {
    next(error);
  }
};
