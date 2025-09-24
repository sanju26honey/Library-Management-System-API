const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.get("/books/:id/reviews", reviewController.getReviews);
router.post("/books/:id/reviews", protect, reviewController.createReview);
router.put("/books/:id/reviews/:reviewId", protect, reviewController.updateReview);
router.delete("/books/:id/reviews/:reviewId", protect, reviewController.deleteReview);

module.exports = router;
