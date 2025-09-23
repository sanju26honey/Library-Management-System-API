const express = require("express");
const router = express.Router();
const {
  getLoans,
  createLoan,
  updateLoan,
  returnLoan,
} = require("../controllers/loanController");

const { protect } = require("../middleware/authMiddleware");

// GET /loans
router.get("/", getLoans);

// POST /loans (create new loan)
router.post("/", protect, createLoan);

// PUT /loans/:id (update loan)
router.put("/:id", protect, updateLoan);

// DELETE /loans/:id (mark returned)
router.delete("/:id", protect, returnLoan);

module.exports = router;
