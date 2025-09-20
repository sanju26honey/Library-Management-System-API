// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// GET /auth/token - generate a new JWT
router.get("/token", (req, res) => {
  const payload = { role: "admin" }; // you can add anything you like
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });

  res.json({ token });
});

module.exports = router;