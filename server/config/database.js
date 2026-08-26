import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let sequelize;

const fallbackDbUrl = "postgresql://neondb_owner:npg_MY1SptvGbT0m@ep-round-shadow-ayqkqpfy.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require";

if (process.env.DATABASE_URL || fallbackDbUrl) {
  const connectionUrl = process.env.DATABASE_URL || fallbackDbUrl;
  const isNeon = connectionUrl.includes("neon.tech");
  
  sequelize = new Sequelize(connectionUrl, {
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? (msg) => console.log(`[SQL]: ${msg}`) : false,
    dialectOptions: (isNeon || process.env.DATABASE_SSL === "true") ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    } : {},
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || "chulha_db",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "postgres",
    {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      dialect: "postgres",
      logging: process.env.NODE_ENV === "development" ? (msg) => console.log(`[SQL]: ${msg}`) : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully via Sequelize!");
    return true;
  } catch (error) {
    console.warn("⚠️  PostgreSQL connection warning:", error.message);
    console.warn("💡 Tip: Make sure your PostgreSQL server is running and credentials in .env are correct.");
    return false;
  }
};

export default sequelize;
