// Simple JSON-file based data store.
// No native modules, no compilation, no external database server required.
// All data lives in backend/data.json, read fully into memory and
// rewritten to disk on every change. That's plenty for a small library app.

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "data.json");

function seedData() {
  const now = new Date().toISOString();
  return {
    books: [
      {
        id: 1,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        isbn: "9780547928227",
        category: "Fantasy",
        quantity: 3,
        available: 3,
        created_at: now,
      },
      {
        id: 2,
        title: "Clean Code",
        author: "Robert C. Martin",
        isbn: "9780132350884",
        category: "Technology",
        quantity: 2,
        available: 2,
        created_at: now,
      },
      {
        id: 3,
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        isbn: "9780553380163",
        category: "Science",
        quantity: 4,
        available: 4,
        created_at: now,
      },
      {
        id: 4,
        title: "1984",
        author: "George Orwell",
        isbn: "9780451524935",
        category: "Fiction",
        quantity: 5,
        available: 5,
        created_at: now,
      },
      {
        id: 5,
        title: "The Alchemist",
        author: "Paulo Coelho",
        isbn: "9780061122415",
        category: "Fiction",
        quantity: 3,
        available: 3,
        created_at: now,
      },
      {
        id: 6,
        title: "Atomic Habits",
        author: "James Clear",
        isbn: "9780735211292",
        category: "Self-Help",
        quantity: 4,
        available: 4,
        created_at: now,
      },
      {
        id: 7,
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        isbn: "9780135957059",
        category: "Technology",
        quantity: 2,
        available: 2,
        created_at: now,
      },
      {
        id: 8,
        title: "Rich Dad Poor Dad",
        author: "Robert T. Kiyosaki",
        isbn: "9781612681139",
        category: "Finance",
        quantity: 5,
        available: 5,
        created_at: now,
      },
      {
        id: 9,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "9780743273565",
        category: "Fiction",
        quantity: 3,
        available: 3,
        created_at: now,
      },
      {
        id: 10,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        isbn: "9780062316097",
        category: "History",
        quantity: 4,
        available: 4,
        created_at: now,
      },
      {
        id: 11,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        isbn: "9780857197689",
        category: "Finance",
        quantity: 3,
        available: 3,
        created_at: now,
      },
      {
        id: 12,
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        isbn: "9780262046305",
        category: "Technology",
        quantity: 2,
        available: 2,
        created_at: now,
      },
      {
        id: 13,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        isbn: "9780547928227",
        category: "Fantasy",
        quantity: 4,
        available: 4,
        created_at: now,
      },
      {
        id: 14,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "9780061120084",
        category: "Fiction",
        quantity: 3,
        available: 3,
        created_at: now,
      },
    ],
    members: [],
    borrows: [],
    counters: { books: 14, members: 1, borrows: 1 },
  };
}

function readData() {
  if (!fs.existsSync(DATA_PATH)) {
    const initial = seedData();
    fs.writeFileSync(DATA_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function nextId(data, key) {
  const id = data.counters[key];
  data.counters[key] += 1;
  return id;
}

module.exports = { readData, writeData, nextId };
