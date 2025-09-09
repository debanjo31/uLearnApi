import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
