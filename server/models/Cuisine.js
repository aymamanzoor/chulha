import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Cuisine = sequelize.define(
  "Cuisine",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    flag: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "🥘",
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
  },
  {
    tableName: "cuisines",
    timestamps: true,
  }
);

export default Cuisine;
