import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Follow = sequelize.define(
  "Follow",
  {
    followerId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    followingId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "follows",
    timestamps: true,
  }
);

export default Follow;
