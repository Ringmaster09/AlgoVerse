const { Router } = require("express");
const User = require("../models/user");

const router = Router();

// GET signin page
router.get("/signin", (req, res) => {
  return res.render("signin");
});

// GET signup page
router.get("/signup", (req, res) => {
  return res.render("signup");
});

// POST signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // wait for matchPassword to return
    const user = await User.matchPassword(email, password);

    if (!user) {
      return res.status(401).send("❌ Invalid email or password");
    }

    console.log("✅ User logged in:", user);

    // redirect after login
    return res.redirect("/");
  } catch (err) {
    console.error("❌ Error during signin:", err.message);
    return res.status(401).send("❌ " + err.message);
  }
});

// POST signup
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Create & save user
    const user = await User.create({ fullName, email, password });
    console.log("✅ User saved:", user);

    return res.redirect("/"); // after signup redirect to home
  } catch (err) {
    console.error("❌ Error during signup:", err);
    return res.status(500).send("Something went wrong during signup");
  }
});

module.exports = router;
