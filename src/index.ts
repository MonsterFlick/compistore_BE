import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes";
import { Product } from "./entity/Product";

dotenv.config();
const app = express();
const allowedOrigins = process.env.ORIGINS?.split(",") || [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  }
}));app.use(express.json());
app.use("/products", productRoutes);

createConnection({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Product],
  synchronize: true,
  ssl: { rejectUnauthorized: false }
}).then(() => {
  const port = parseInt(process.env.PORT || "3000");
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch((err) => {
  console.error("DB Connection Error:", err);
});
