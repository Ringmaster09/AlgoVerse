const { Router } = require("express");
const Post = require("../models/Post");
const requireAuth = require("../middlewares/requireAuth");

const router = Router();

router.get("/", async (req, res) => {
  const posts = await Post.find().populate("author", "fullName");
  res.render("posts", { posts });
});

router.get("/create", requireAuth, (req, res) => {
  res.render("createPost");
});

router.post("/create", requireAuth, async (req, res) => {
  const { title, content } = req.body;
  await Post.create({ title, content, author: req.user._id });
  res.redirect("/posts");
});

module.exports = router;
