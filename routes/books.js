const express = require("express");
const { readData, writeData, nextId } = require("../store");

const router = express.Router();

// GET /api/books?search=term
router.get("/", (req, res) => {
  const { search } = req.query;
  const data = readData();
  let books = [...data.books];

  if (search) {
    const q = search.toLowerCase();
    books = books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.category || "").toLowerCase().includes(q) ||
        (b.isbn || "").toLowerCase().includes(q)
    );
  }

  books.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(books);
});

// GET /api/books/:id
router.get("/:id", (req, res) => {
  const data = readData();
  const book = data.books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// POST /api/books
router.post("/", (req, res) => {
  const { title, author, isbn, category, quantity } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: "Title and author are required" });
  }

  const data = readData();
  const qty = Number(quantity) > 0 ? Number(quantity) : 1;
  const book = {
    id: nextId(data, "books"),
    title,
    author,
    isbn: isbn || "",
    category: category || "",
    quantity: qty,
    available: qty,
    created_at: new Date().toISOString(),
  };
  data.books.push(book);
  writeData(data);

  res.status(201).json(book);
});

// PUT /api/books/:id
router.put("/:id", (req, res) => {
  const data = readData();
  const book = data.books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });

  const { title, author, isbn, category, quantity } = req.body;
  const newQuantity = quantity !== undefined ? Number(quantity) : book.quantity;
  const borrowedCount = book.quantity - book.available;
  const newAvailable = Math.max(newQuantity - borrowedCount, 0);

  book.title = title ?? book.title;
  book.author = author ?? book.author;
  book.isbn = isbn ?? book.isbn;
  book.category = category ?? book.category;
  book.quantity = newQuantity;
  book.available = newAvailable;

  writeData(data);
  res.json(book);
});

// DELETE /api/books/:id
router.delete("/:id", (req, res) => {
  const data = readData();
  const id = Number(req.params.id);
  const book = data.books.find((b) => b.id === id);
  if (!book) return res.status(404).json({ error: "Book not found" });

  const hasActiveBorrow = data.borrows.some((r) => r.book_id === id && r.status === "borrowed");
  if (hasActiveBorrow) {
    return res.status(400).json({ error: "Cannot delete a book that is currently borrowed" });
  }

  data.books = data.books.filter((b) => b.id !== id);
  writeData(data);
  res.json({ message: "Book deleted" });
});

module.exports = router;
