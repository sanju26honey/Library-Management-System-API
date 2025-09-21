const Book = require("../models/Book");
const mongoose = require("mongoose");

// @desc Get all books with pagination + filters
exports.getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, title, author, category } = req.query;

    let query = {};
    if (title) query.title = { $regex: title, $options: "i" };
    if (author) query.author = { $regex: author, $options: "i" };
    if (category) query.category = { $regex: category, $options: "i" };

    const books = await Book.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Book.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      data: books,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get book by ID
exports.getBookById = async (req, res) => {
  try {
    console.log(mongoose.Types.ObjectId.isValid(req.params.id))
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid book ID format" });
    }
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Add a new book
exports.createBook = async (req, res) => {
  try {
    const { title, author, category, publishedYear, pages } = req.body;

    // simple validation
    if (!title || !author) {
      return res.status(400).json({ message: "Title and Author are required" });
    }

    const book = new Book({
      title,
      author,
      category,
      publishedYear,
      pages,
    });

    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update book
exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBook) return res.status(404).json({ message: "Book not found" });
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete book
exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
