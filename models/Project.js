const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ProjectSchema = new Schema(
  {
    title: String,
    description: String,
    image: String,
    link: String,
    tags: { type: [String] },
  },
  {
    timestamps: true,
  }
);

const ProjectModel = model("Project", ProjectSchema);

module.exports = ProjectModel;
