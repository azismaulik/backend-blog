const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CategorySchema = new Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  }
);

const CategoryModel = model("Category", CategorySchema);

module.exports = CategoryModel;
