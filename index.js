const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");

require("dotenv").config();

const CategoryModel = require("./models/Category");
const TagModel = require("./models/Tag");
const UserModel = require("./models/User");
const PostModel = require("./models/Post");

const app = express();
const connect = mongoose.connect(process.env.MONGODB_URL);
const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;

// cors with origin localhost:3000
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(fileupload({ useTempFiles: true }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get("/", (req, res) => {
  res.send("hello world");
});

// register
app.post("/api/v1/auth/register", async (req, res) => {
  // login with checking username
  const { username, password } = req.body;
  try {
    const userDoc = await UserModel.findOne({ username });
    if (userDoc) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hash = bcrypt.hashSync(password, salt);
    const user = new UserModel({ username, password: hash });
    await user.save();
    res.json(user);
  } catch (e) {
    res.status(400).json(e);
  }
});

// login with set cookie to browser
app.post("/api/v1/auth/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await UserModel.findOne({ username });
    if (!userDoc) {
      return res.status(400).json({ error: "User not found" });
    }
    const passwordIsValid = bcrypt.compareSync(password, userDoc.password);
    if (!passwordIsValid) {
      return res.status(400).json({ error: "Invalid password" });
    }
    if (passwordIsValid) {
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) {
          return res.status(500).json({ error: "Internal server error" });
        }
        res.cookie("token", token, { httpOnly: true }).status(200).json({
          message: "Login successful",
          token: token,
        });
      });
    }
  } catch (e) {
    res.status(400).json({ error: "Bad request" });
  }
});

// logout with delete cookie
app.post("/api/v1/auth/logout", async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
});

// post category
app.post("/api/v1/category", async (req, res) => {
  const { name } = req.body;
  try {
    const categoryDoc = await CategoryModel.create({
      name,
    });
    res.json(categoryDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

// get category
app.get("/api/v1/category", async (req, res) => {
  try {
    const categoryDoc = await CategoryModel.find({});
    res.json(categoryDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

// GET endpoint to retrieve a category by ID
app.get("/api/v1/category/:id", async (req, res) => {
  const categoryId = req.params.id;

  try {
    const categoryDoc = await CategoryModel.findById(categoryId);
    if (!categoryDoc) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(categoryDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

// PUT endpoint to update a category by ID
app.put("/api/v1/category/:id", async (req, res) => {
  const categoryId = req.params.id;
  const updatedData = req.body;

  try {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      updatedData,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(updatedCategory);
  } catch (e) {
    res.status(400).json(e);
  }
});

// DELETE endpoint to delete a category by ID
app.delete("/api/v1/category/:id", async (req, res) => {
  const categoryId = req.params.id;

  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(deletedCategory);
  } catch (e) {
    res.status(400).json(e);
  }
});

// post tag
app.post("/api/v1/tag", async (req, res) => {
  const { name } = req.body;
  try {
    const tagDoc = await TagModel.create({
      name,
    });
    res.json(tagDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

// get tag
app.get("/api/v1/tag", async (req, res) => {
  try {
    const tagDoc = await TagModel.find({});
    res.json(tagDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

if (connect) {
  app.listen(process.env.PORT, () => {
    console.log("connected to db, listening on port", process.env.PORT);
  });
}

// GET endpoint to retrieve a tag by ID
app.get("/api/v1/tag/:id", async (req, res) => {
  const tagId = req.params.id;

  try {
    const tagDoc = await TagModel.findById(tagId);
    if (!tagDoc) {
      return res.status(404).json({ error: "tag not found" });
    }
    res.json(tagDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

// PUT endpoint to update a tag by ID
app.put("/api/v1/tag/:id", async (req, res) => {
  const tagId = req.params.id;
  const updatedData = req.body;

  try {
    const updatedTag = await TagModel.findByIdAndUpdate(tagId, updatedData, {
      new: true,
    });
    if (!updatedTag) {
      return res.status(404).json({ error: "tag not found" });
    }
    res.json(updatedTag);
  } catch (e) {
    res.status(400).json(e);
  }
});

// DELETE endpoint to delete a tag by ID
app.delete("/api/v1/tag/:id", async (req, res) => {
  const tagId = req.params.id;

  try {
    const deletedTag = await TagModel.findByIdAndDelete(tagId);
    if (!deletedTag) {
      return res.status(404).json({ error: "tag not found" });
    }
    res.json(deletedTag);
  } catch (e) {
    res.status(400).json(e);
  }
});

// POST endpoint to create a new post with cover to cloudinary
app.post("/api/v1/posts", async (req, res) => {
  try {
    const { title, category, summary, content } = req.body;
    const categories = JSON.parse(category);

    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Image file missing" });
    }

    const file = req.files.image;

    // Buat URL untuk Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "posts",
    });

    // Buat entri posting baru
    const newPost = new PostModel({
      title,
      categories,
      summary,
      content,
      cover: result.secure_url,
    });

    await newPost.save();

    return res.status(201).json(newPost); // Menggunakan status 201 untuk Created
  } catch (e) {
    console.error("An error occurred:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET endpoint to retrieve all posts
app.get("/api/v1/posts", async (req, res) => {
  try {
    const posts = await PostModel.find({});
    res.json(posts);
  } catch (e) {
    res.status(400).json(e);
  }
});

// GET endpoint to retrieve a post by ID
app.get("/api/v1/posts/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const postDoc = await PostModel.findById(postId);
    if (!postDoc) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(postDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

// update a post
app.put("/api/v1/posts/:id", async (req, res) => {
  const postId = req.params.id;
  const { title, category, summary, content } = req.body;

  const categories = JSON.parse(category);

  if (!req.files || !req.files.image) {
    return res.status(400).json({ message: "Image file missing" });
  }

  const file = req.files.image;

  // Buat URL untuk Cloudinary
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "posts",
  });

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(postId, {
      title,
      categories,
      summary,
      content,
      cover: result.secure_url,
    });
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(updatedPost);
  } catch (e) {
    res.status(400).json(e);
  }
});

// delete a post
app.delete("/api/v1/posts/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const deletedPost = await PostModel.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(deletedPost);
  } catch (e) {
    res.status(400).json(e);
  }
});
