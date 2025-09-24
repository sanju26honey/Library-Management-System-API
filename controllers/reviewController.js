const Review = require("../models/Review");
const Book = require("../models/Book");

// GET all reviews for a book
exports.getReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const bookId = req.params.id;

    const reviews = await Review.find({ book: bookId })
      .populate("user", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ book: bookId });

    res.json({
      reviews,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST a new review
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const bookId = req.params.id;

    const bookExists = await Book.findById(bookId);
    if (!bookExists) return res.status(404).json({ message: "Book not found" });

    const review = new Review({
      book: bookId,
      user: req.user,
      rating,
      comment,
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update a review
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id, reviewId } = req.params;

    const review = await Review.findOne({
      _id: reviewId,
      book: id,
      user: req.user,
    });

    if (!review) return res.status(404).json({ message: "Review not found" });

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE a review
exports.deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      book: id,
      user: req.user,
    });

    if (!review) return res.status(404).json({ message: "Review not found" });

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
