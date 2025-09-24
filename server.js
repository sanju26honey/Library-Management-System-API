const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Routes
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/authors", require("./routes/authorRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/loans", require("./routes/loanRoutes"));
app.use("/api", require("./routes/reviewRoutes"));
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
