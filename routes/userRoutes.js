const express = require("express");
const router = express.Router();

// Controllers
const {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  uploadProfilePicture,
  updateUser,
  deleteUser
} = require("../controllers/userController");

// Middleware
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // import your existing Multer

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", protect, getUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

// Use the imported upload middleware
router.patch(
  "/upload-profile-picture",
  protect,
  upload.single("profilePicture"),
  uploadProfilePicture
);

module.exports = router;
