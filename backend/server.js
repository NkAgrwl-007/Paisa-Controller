// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ API Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/budget", require("./routes/budgetRoutes"));
app.use("/api/insights", require("./routes/insightRoutes"));

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ message: "💰 Paisa Controller API is running..." });
});

// ✅ 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
