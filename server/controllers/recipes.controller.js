import { Op } from "sequelize";
import { Recipe, User, Cuisine, Like, SavedItem, Comment } from "../models/index.js";

// Generate clean URL slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const getRecipes = async (req, res, next) => {
  try {
    const {
      query,
      category,
      cuisine,
      difficulty,
      maxTime,
      beginner,
      limit = 50,
      offset = 0,
    } = req.query;

    const where = {};
    // If not admin, only show Approved recipes
    if (!req.user || (req.user.role !== "Admin" && req.user.role !== "Moderator")) {
      where.status = "Approved";
    }

    if (query) {
      const q = `%${query.trim().toLowerCase()}%`;
      where[Op.or] = [
        { title: { [Op.iLike]: q } },
        { description: { [Op.iLike]: q } },
        { cuisineName: { [Op.iLike]: q } },
      ];
    }

    if (category && category !== "All") {
      where.category = category;
    }

    if (cuisine && cuisine !== "All") {
      where.cuisineName = cuisine;
    }

    if (difficulty && difficulty !== "All") {
      where.difficulty = difficulty;
    }

    if (maxTime && Number(maxTime) > 0) {
      where.minutes = { [Op.lte]: Number(maxTime) };
    }

    if (beginner === "true") {
      where.beginner = true;
    }

    const creatorInclude = {
      model: User,
      as: "creator",
      attributes: ["id", "name", "username", "emoji", "bio"],
    };

    if (!req.user || (req.user.role !== "Admin" && req.user.role !== "Moderator")) {
      creatorInclude.where = { status: "Active" };
    }

    const { count, rows: recipes } = await Recipe.findAndCountAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      order: [["createdAt", "DESC"]],
      include: [creatorInclude],
    });

    const userId = req.user?.id;
    const formattedRecipes = await Promise.all(
      recipes.map(async (r) => {
        const json = r.toJSON();
        const likesCount = await Like.count({ where: { targetType: "recipe", targetId: r.id } });
        json.likes = likesCount;

        if (userId) {
          const isLiked = await Like.findOne({ where: { userId, targetType: "recipe", targetId: r.id } });
          const isSaved = await SavedItem.findOne({ where: { userId, targetType: "recipe", targetId: r.id } });
          json.isLiked = !!isLiked;
          json.isSaved = !!isSaved;
        } else {
          json.isLiked = false;
          json.isSaved = false;
        }

        return json;
      })
    );

    return res.json({
      total: count,
      recipes: formattedRecipes,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecipeBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const creatorInclude = {
      model: User,
      as: "creator",
      attributes: ["id", "name", "username", "emoji", "bio"],
    };

    if (!req.user || (req.user.role !== "Admin" && req.user.role !== "Moderator")) {
      creatorInclude.where = { status: "Active" };
    }

    const recipe = await Recipe.findOne({
      where: { slug },
      include: [
        creatorInclude,
        {
          model: Cuisine,
          as: "cuisine",
          attributes: ["id", "name", "slug", "flag", "image"],
        },
      ],
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    // Also check recipe status
    if (!req.user || (req.user.role !== "Admin" && req.user.role !== "Moderator")) {
      if (recipe.status !== "Approved") {
        return res.status(404).json({ message: "Recipe not found." });
      }
    }

    const json = recipe.toJSON();
    json.likes = await Like.count({ where: { targetType: "recipe", targetId: recipe.id } });

    if (req.user) {
      const isLiked = await Like.findOne({ where: { userId: req.user.id, targetType: "recipe", targetId: recipe.id } });
      const isSaved = await SavedItem.findOne({ where: { userId: req.user.id, targetType: "recipe", targetId: recipe.id } });
      json.isLiked = !!isLiked;
      json.isSaved = !!isSaved;
    }

    return res.json({ recipe: json });
  } catch (error) {
    next(error);
  }
};

export const createRecipe = async (req, res, next) => {
  try {
    const {
      title,
      cuisineName,
      minutes,
      difficulty,
      category = "Dinner",
      description = "",
      ingredients,
      steps,
      tip = "",
      beginner = false,
      image,
    } = req.body;

    if (!title || !cuisineName || !minutes) {
      return res.status(400).json({ message: "Title, cuisine, and minutes are required." });
    }

    let slug = slugify(title);
    const existing = await Recipe.findOne({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const cuisine = await Cuisine.findOne({ where: { name: cuisineName } });

    const recipe = await Recipe.create({
      slug,
      title,
      image: image || (req.file ? `/uploads/${req.file.filename}` : "/assets/recipe-biryani.jpg"),
      creatorId: req.user.id,
      cuisineId: cuisine?.id || null,
      cuisineName,
      flag: cuisine?.flag || "🥘",
      minutes: Number(minutes) || 30,
      difficulty: difficulty || "Easy",
      category,
      beginner: beginner === "true" || beginner === true,
      description,
      ingredients: typeof ingredients === "string" ? ingredients.split("\n").filter(Boolean) : ingredients || [],
      steps: typeof steps === "string" ? steps.split("\n").filter(Boolean) : steps || [],
      tip,
      status: "Approved",
    });

    return res.status(201).json({
      message: "Recipe created successfully!",
      recipe,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRecipeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    if (status) recipe.status = status;
    await recipe.save();

    return res.json({ message: `Recipe status updated to ${status}`, recipe });
  } catch (error) {
    next(error);
  }
};

export const deleteRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    if (recipe.creatorId !== req.user.id && req.user.role !== "Admin" && req.user.role !== "Moderator") {
      return res.status(403).json({ message: "Not authorized to delete this recipe." });
    }

    await recipe.destroy();
    return res.json({ message: "Recipe deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export const toggleLikeRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    const existingLike = await Like.findOne({
      where: { userId, targetType: "recipe", targetId: id },
    });

    if (existingLike) {
      await existingLike.destroy();
      const likesCount = await Like.count({ where: { targetType: "recipe", targetId: id } });
      return res.json({ message: "Unliked recipe", isLiked: false, likesCount });
    } else {
      await Like.create({ userId, targetType: "recipe", targetId: id });
      const likesCount = await Like.count({ where: { targetType: "recipe", targetId: id } });
      return res.json({ message: "Liked recipe", isLiked: true, likesCount });
    }
  } catch (error) {
    next(error);
  }
};

export const toggleSaveRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    const existing = await SavedItem.findOne({
      where: { userId, targetType: "recipe", targetId: id },
    });

    if (existing) {
      await existing.destroy();
      return res.json({ message: "Recipe removed from bookmarks", isSaved: false });
    } else {
      await SavedItem.create({ userId, targetType: "recipe", targetId: id });
      return res.json({ message: "Recipe saved to bookmarks", isSaved: true });
    }
  } catch (error) {
    next(error);
  }
};
