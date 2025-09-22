const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  uploadBookCover
} = require("../controllers/BookController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", protect, createBook);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);
router.patch("/:id/upload-cover", protect, upload.single("cover"), uploadBookCover);

module.exports = router;