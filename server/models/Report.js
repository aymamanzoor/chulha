import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Report = sequelize.define(
  "Report",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    target: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("Post", "Comment", "User"),
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    reporterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("Open", "Reviewing", "Resolved", "Dismissed"),
      defaultValue: "Open",
    },
  },
  {
    tableName: "reports",
    timestamps: true,
  }
);

export default Report;
