import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Comment = sequelize.define(
  "Comment",
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
    postId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "posts",
        key: "id",
      },
    },
    recipeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "recipes",
        key: "id",
      },
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "comments",
        key: "id",
      },
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "comments",
    timestamps: true,
  }
);

export default Comment;
