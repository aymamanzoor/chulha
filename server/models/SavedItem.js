import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const SavedItem = sequelize.define(
  "SavedItem",
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
    targetType: {
      type: DataTypes.ENUM("post", "recipe"),
      allowNull: false,
    },
    targetId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "saved_items",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "targetType", "targetId"],
      },
    ],
  }
);

export default SavedItem;
