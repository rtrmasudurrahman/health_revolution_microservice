import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import morgan from "morgan";
import {
  createTodo,
  deleteTodoById,
  getAllTodos,
  updateTodo,
} from "./controllers";

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
// app.get("/products/:id", getProductDetails);
app.put("/todos/:id", updateTodo);
app.delete("/todos/:id", deleteTodoById);
app.get("/todos", getAllTodos);
app.post("/todos", createTodo);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const port = process.env.PORT || 4010;
const serviceName = process.env.SERVICE_NAME || "Todo-Service";

app.listen(port, () => {
  console.log(`${serviceName} is running on port ${port}`);
});
