const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/algoverse")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.use("/user", userRoute);

// Start server
app.listen(PORT, () => console.log(`🚀 Server started at PORT: ${PORT}`));
