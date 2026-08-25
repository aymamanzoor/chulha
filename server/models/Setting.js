import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Setting = sequelize.define(
  "Setting",
  {
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    value: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "settings",
    timestamps: true,
  }
);

export default Setting;
