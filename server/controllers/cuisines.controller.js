import { Cuisine, Recipe } from "../models/index.js";

export const getCuisines = async (req, res, next) => {
  try {
    const cuisines = await Cuisine.findAll({
      order: [["name", "ASC"]],
      include: [
        {
          model: Recipe,
          as: "recipes",
          attributes: ["id"],
        },
      ],
    });

    const formatted = cuisines.map((c) => {
      const json = c.toJSON();
      json.recipesCount = json.recipes ? json.recipes.length : 0;
      delete json.recipes;
      return json;
    });

    return res.json({ cuisines: formatted });
  } catch (error) {
    next(error);
  }
};

export const getCuisineBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const cuisine = await Cuisine.findOne({
      where: { slug },
      include: [
        {
          model: Recipe,
          as: "recipes",
          where: { status: "Approved" },
          required: false,
        },
      ],
    });

    if (!cuisine) {
      return res.status(404).json({ message: "Cuisine not found." });
    }

    const json = cuisine.toJSON();
    json.recipesCount = json.recipes ? json.recipes.length : 0;

    return res.json({ cuisine: json, recipes: json.recipes || [] });
  } catch (error) {
    next(error);
  }
};

export const createCuisine = async (req, res, next) => {
  try {
    const { name, flag, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Cuisine name is required." });
    }

    const slug = name.toLowerCase().replace(/[\s\W-]+/g, "-");

    const existing = await Cuisine.findOne({ where: { slug } });
    if (existing) {
      return res.status(400).json({ message: "Cuisine with this name already exists." });
    }

    const cuisine = await Cuisine.create({
      name,
      slug,
      flag: flag || "🥘",
      description: description || "",
      image: req.file ? `/uploads/${req.file.filename}` : "/assets/hero-table.jpg",
    });

    return res.status(201).json({
      message: "Cuisine created successfully!",
      cuisine,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCuisine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cuisine = await Cuisine.findByPk(id);

    if (!cuisine) {
      return res.status(404).json({ message: "Cuisine not found." });
    }

    await cuisine.destroy();
    return res.json({ message: "Cuisine deleted." });
  } catch (error) {
    next(error);
  }
};
