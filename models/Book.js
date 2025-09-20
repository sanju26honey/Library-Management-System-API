const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true },
    category: { type: String },
    publishedYear: { type: Number },
    pages: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", BookSchema);