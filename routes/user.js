// routes/user.js
const { Router } = require("express");
const User = require("../models/user");
const { createTokenForUser } = require("../services/auth");

const router = Router();

// Render signin + signup pages
router.get("/signin", (req, res) => res.render("signin"));
router.get("/signup", (req, res) => res.render("signup"));

// ----------------- SIGNUP -----------------
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Create & save user
    const user = await User.create({ fullName, email, password });

    console.log("✅ User registered:", user.email);

    // Redirect to signin page
    res.redirect("/user/signin");
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    res.status(500).send("Signup error: " + err.message);
  }
});

// ----------------- SIGNIN -----------------
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verify credentials
    const user = await User.matchPassword(email, password);

    // Create JWT token
    const token = createTokenForUser(user);

    // Store token in cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    console.log("✅ User signed in:", user.email);

    // Redirect to posts/dashboard
    res.redirect("/posts");
  } catch (err) {
    console.error("❌ Signin error:", err.message);
    res.status(401).send("Signin error: " + err.message);
  }
});

// ----------------- LOGOUT -----------------
router.get("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.redirect("/");
});

module.exports = router;
