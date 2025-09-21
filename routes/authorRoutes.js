const express = require('express');
const router = express.Router();
const {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAuthors);
router.get("/:id", getAuthorById);
router.post("/", protect, createAuthor);
router.put("/:id", protect, updateAuthor);
router.delete("/:id", protect, deleteAuthor);

module.exports = router;
