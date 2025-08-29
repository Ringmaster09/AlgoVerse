require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/user");
const postRoute = require("./routes/post");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB Error:", err));

// Routes
app.get("/", (req, res) => {
  res.render("home");
});
app.use("/user", userRoute);
app.use("/posts", postRoute);

// Start server
app.listen(PORT, () => console.log(`🚀 AlgoVerse running at http://localhost:${PORT}`));
