const express = require("express");
const { readData, writeData, nextId } = require("../store");

const router = express.Router();

// GET /api/borrows?status=borrowed|returned
router.get("/", (req, res) => {
  const { status } = req.query;
  const data = readData();

  let borrows = [...data.borrows];
  if (status) {
    borrows = borrows.filter((r) => r.status === status);
  }

  const enriched = borrows
    .map((r) => {
      const book = data.books.find((b) => b.id === r.book_id);
      const member = data.members.find((m) => m.id === r.member_id);
      return {
        id: r.id,
        borrow_date: r.borrow_date,
        due_date: r.due_date,
        return_date: r.return_date,
        status: r.status,
        book_id: r.book_id,
        book_title: book ? book.title : "(deleted book)",
        book_author: book ? book.author : "",
        member_id: r.member_id,
        member_name: member ? member.name : "(deleted member)",
      };
    })
    .sort((a, b) => new Date(b.borrow_date) - new Date(a.borrow_date));

  res.json(enriched);
});

// POST /api/borrows -> issue a book to a member
router.post("/", (req, res) => {
  const { book_id, member_id, due_date } = req.body;
  if (!book_id || !member_id) {
    return res.status(400).json({ error: "book_id and member_id are required" });
  }

  const data = readData();
  const book = data.books.find((b) => b.id === Number(book_id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  if (book.available <= 0) {
    return res.status(400).json({ error: "No copies of this book are currently available" });
  }

  const member = data.members.find((m) => m.id === Number(member_id));
  if (!member) return res.status(404).json({ error: "Member not found" });

  const borrow = {
    id: nextId(data, "borrows"),
    book_id: book.id,
    member_id: member.id,
    borrow_date: new Date().toISOString(),
    due_date: due_date || null,
    return_date: null,
    status: "borrowed",
  };
  data.borrows.push(borrow);
  book.available -= 1;

  writeData(data);
  res.status(201).json({ message: "Book issued successfully" });
});

// PUT /api/borrows/:id/return
router.put("/:id/return", (req, res) => {
  const data = readData();
  const record = data.borrows.find((r) => r.id === Number(req.params.id));
  if (!record) return res.status(404).json({ error: "Borrow record not found" });
  if (record.status === "returned") {
    return res.status(400).json({ error: "This book has already been returned" });
  }

  record.status = "returned";
  record.return_date = new Date().toISOString();

  const book = data.books.find((b) => b.id === record.book_id);
  if (book) book.available += 1;

  writeData(data);
  res.json({ message: "Book returned successfully" });
});

module.exports = router;
