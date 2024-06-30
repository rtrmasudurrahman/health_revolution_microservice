import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import {
  createInventory,
  getInventoryById,
  getInventoryDetails,
  updateInventory,
} from "./controllers";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "UP" });
});

// app.use((req, res, next) => {
//   const allowedOrigins = ["http://localhost:8081", "http://127.0.0.1:8081"];
//   const origin = req.headers.origin || "";

//   if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//     next();
//   } else {
//     res.status(403).json({ message: "Forbidden" });
//   }
// });

// routes
app.get("/inventories/:id/details", getInventoryDetails);
app.get("/inventories/:id", getInventoryById);
app.put("/inventories/:id", updateInventory);
app.post("/inventories", createInventory);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

// error handler
app.use((_err, _req, res, _next) => {
  res.status(500).json({ message: "internal server error" });
});

const port = process.env.PORT || 4002;

const serviceName = process.env.SERVICE_NAME || "Inventory-Service";

app.listen(port, () => {
  console.log(`${serviceName} is running on port ${port}`);
});