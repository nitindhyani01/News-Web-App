const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Homepage Route
router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "DailyLens - Your News Source",
      description: "Get the latest news and updates",
    };

    const posts = await Post.find().sort({ createdAt: -1 });

    res.render("./layouts/index", { locals, posts });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
