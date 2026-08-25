import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    kind: {
      type: DataTypes.ENUM("Food Post", "Recipe", "Cooking Tip"),
      defaultValue: "Food Post",
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    recipeSlug: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
  },
  {
    tableName: "posts",
    timestamps: true,
  }
);

export default Post;
