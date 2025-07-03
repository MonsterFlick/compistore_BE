import "reflect-metadata";
import express from "express";
import { createConnection, getConnectionManager } from "typeorm";
import cors from "cors";
import dotenv from "dotenv";
import { Product } from "../src/entity/Product";
import productRoutes from "../src/routes/productRoutes";
import { VercelRequest, VercelResponse } from '@vercel/node';

dotenv.config();
const app = express();
const allowedOrigins = process.env.ORIGINS?.split(",") || [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  }
}));
app.use(express.json());
app.use("/products", productRoutes);

// Keep connection cached to avoid reconnecting on every invocation
const connectDB = async () => {
  const connectionManager = getConnectionManager();
  if (!connectionManager.has("default")) {
    await createConnection({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Product],
      synchronize: true,
      ssl: { rejectUnauthorized: false }
    });
  }
};

export default async (req: VercelRequest, res: VercelResponse) => {
  await connectDB();
  app(req, res); // forward request to Express
};
