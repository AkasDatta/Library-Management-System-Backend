const express = require("express");
const cors = require("cors");

const booksRouter = require("./routes/books");
const membersRouter = require("./routes/members");
const borrowsRouter = require("./routes/borrows");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Library Management System API is running",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Library API is running",
  });
});

// API routes
app.use("/api/books", booksRouter);
app.use("/api/members", membersRouter);
app.use("/api/borrows", borrowsRouter);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Something went wrong on the server",
  });
});

app.listen(PORT, () => {
  console.log(`Library backend running on http://localhost:${PORT}`);
});
