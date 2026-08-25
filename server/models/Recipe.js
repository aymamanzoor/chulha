import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Recipe = sequelize.define(
  "Recipe",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    creatorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    cuisineId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "cuisines",
        key: "id",
      },
    },
    cuisineName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "General",
    },
    flag: {
      type: DataTypes.STRING(10),
      defaultValue: "🥘",
    },
    minutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    difficulty: {
      type: DataTypes.ENUM("Easy", "Medium", "Hard"),
      defaultValue: "Easy",
    },
    category: {
      type: DataTypes.STRING(50),
      defaultValue: "Dinner",
    },
    beginner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 4.8,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    ingredients: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    steps: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    tip: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    status: {
      type: DataTypes.ENUM("Approved", "Pending", "Rejected"),
      defaultValue: "Approved",
    },
  },
  {
    tableName: "recipes",
    timestamps: true,
  }
);

export default Recipe;
