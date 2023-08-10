const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const CategoryModel = require("./models/Category");
const TagModel = require("./models/Tag");

const app = express();
const connect = mongoose.connect(process.env.MONGODB_URL);

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello world");
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
