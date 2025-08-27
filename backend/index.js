const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const bodyparser = require("body-parser");
app.use(bodyparser.json());

// Import routes
const analyzeRouter = require("./routes/analyzeRouter");
const authRouter = require("./routes/authRouter");

// Import MongoDB connection
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/satyaai")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/analyze", analyzeRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "SatyaAI Backend API",
    status: "running",
    version: "1.0.0",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
