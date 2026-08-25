import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Like = sequelize.define(
  "Like",
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
      type: DataTypes.ENUM("post", "recipe", "comment"),
      allowNull: false,
    },
    targetId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "likes",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "targetType", "targetId"],
      },
    ],
  }
);

export default Like;
