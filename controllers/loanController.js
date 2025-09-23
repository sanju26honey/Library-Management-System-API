const mongoose = require("mongoose");
const Book = require("../models/Book");
const User = require("../models/User");
const Loan = require("../models/Loan");

// Helper: validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /loans - list loans with pagination and filters
exports.getLoans = async (req, res) => {
  try {
    const { page = 1, limit = 10, book, user, status } = req.query;
    const filter = {};

    if (book && isValidId(book)) filter.book = book;
    if (user && isValidId(user)) filter.user = user;
    if (status) filter.status = status;

    const loans = await Loan.find(filter)
      .populate("book", "title")   // optional pop to show book title
      .populate("user", "name email")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Loan.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      data: loans,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch loans", error: err.message });
  }
};

// POST /loans - create a loan (auth required)
exports.createLoan = async (req, res) => {
  try {
    const { book, user, dueDate, notes } = req.body;

    // Basic validation
    if (!book || !user || !dueDate) {
      return res.status(400).json({ message: "book, user and dueDate are required" });
    }
    if (!isValidId(book) || !isValidId(user)) {
      return res.status(400).json({ message: "Invalid book or user id format" });
    }

    // Optional: check existence of book and user
    const foundBook = await Book.findById(book);
    if (!foundBook) return res.status(404).json({ message: "Book not found" });

    const foundUser = await User.findById(user);
    if (!foundUser) return res.status(404).json({ message: "User not found" });

    const loan = new Loan({
      book,
      user,
      dueDate,
      notes,
      loanDate: Date.now(),
      status: "ongoing",
    });

    const savedLoan = await loan.save();
    res.status(201).json({ message: "Loan created", loan: savedLoan });
  } catch (err) {
    res.status(500).json({ message: "Failed to create loan", error: err.message });
  }
};

// PUT /loans/:id - update loan details
exports.updateLoan = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "Invalid loan ID" });

    // Prevent accidental overwrite of important fields? (we accept body)
    const updateData = { ...req.body };

    // If status updated to returned and returnDate not set, set it now
    if (updateData.status === "returned" && !updateData.returnDate) {
      updateData.returnDate = Date.now();
    }

    const updatedLoan = await Loan.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedLoan) return res.status(404).json({ message: "Loan not found" });

    res.json({ message: "Loan updated", loan: updatedLoan });
  } catch (err) {
    res.status(500).json({ message: "Failed to update loan", error: err.message });
  }
};

// DELETE /loans/:id - mark loan as returned
exports.returnLoan = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "Invalid loan ID" });

    const loan = await Loan.findById(id);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    if (loan.status === "returned") {
      return res.status(400).json({ message: "Loan already returned" });
    }

    loan.returnDate = new Date();
    loan.status = "returned";

    // Optional: compute fine if overdue
    if (loan.dueDate && loan.returnDate > loan.dueDate) {
      const diffMs = loan.returnDate - loan.dueDate;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      // Example fine: 1 currency unit per day overdue
      loan.fine = diffDays; 
      loan.status = "returned"; // status still returned
    }

    await loan.save();

    res.json({ message: "Loan marked as returned", loan });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark returned", error: err.message });
  }
};
