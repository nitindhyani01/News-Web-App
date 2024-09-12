const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userID = decoded.userID;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
//GET admin login
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "News website",
    };
    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

//POST Check login
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ userID: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

//Admin dashboard
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Dashboard of news web app",
    };
    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      layout: adminLayout,
      data,
    });
  } catch (error) {
    console.log(error);
  }
});

//GET admin Add post
router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Dashboard of news web app",
    };
    const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

//POST Admin Add post
router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });

      await Post.create(newPost);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

//Admin edit post
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Edit post",
    };

    const data = await Post.findOne({ _id: req.params.id });

    res.render("admin/edit-post", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});


//view post
router.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    const locals = {
      title: post.title,
      description: "View post",
    };

    res.render("view-post/index", {
      locals,
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

//Update Post
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });

    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});

// router.post('/register', async(req,res)=>{
//     try {
//         const{username,password}=req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);

//         try {
//             const user = await User.create({username,password:hashedPassword});
//             res.status(201).json({message:'User Created', user});
//         } catch (error) {
//             if(error.code==11000){
//                 res.status(409).json({message:'User already in use'});
//             }
//             res.status(500).json({message:'Internal server error'})
//         }

//     } catch (error) {
//         console.log(error);
//     }
// });

//Admin Delete Post
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

//Admin logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
