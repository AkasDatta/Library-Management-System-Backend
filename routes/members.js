const express = require("express");
const { readData, writeData, nextId } = require("../store");

const router = express.Router();

// GET /api/members
router.get("/", (req, res) => {
  const data = readData();
  const members = [...data.members].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  res.json(members);
});

// GET /api/members/:id
router.get("/:id", (req, res) => {
  const data = readData();
  const member = data.members.find((m) => m.id === Number(req.params.id));
  if (!member) return res.status(404).json({ error: "Member not found" });
  res.json(member);
});

// POST /api/members
router.post("/", (req, res) => {
  const { name, email, phone } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  const data = readData();
  const member = {
    id: nextId(data, "members"),
    name,
    email: email || "",
    phone: phone || "",
    created_at: new Date().toISOString(),
  };
  data.members.push(member);
  writeData(data);

  res.status(201).json(member);
});

// PUT /api/members/:id
router.put("/:id", (req, res) => {
  const data = readData();
  const member = data.members.find((m) => m.id === Number(req.params.id));
  if (!member) return res.status(404).json({ error: "Member not found" });

  const { name, email, phone } = req.body;
  member.name = name ?? member.name;
  member.email = email ?? member.email;
  member.phone = phone ?? member.phone;

  writeData(data);
  res.json(member);
});

// DELETE /api/members/:id
router.delete("/:id", (req, res) => {
  const data = readData();
  const id = Number(req.params.id);
  const member = data.members.find((m) => m.id === id);
  if (!member) return res.status(404).json({ error: "Member not found" });

  const hasActiveBorrow = data.borrows.some((r) => r.member_id === id && r.status === "borrowed");
  if (hasActiveBorrow) {
    return res.status(400).json({ error: "Cannot delete a member with borrowed books" });
  }

  data.members = data.members.filter((m) => m.id !== id);
  writeData(data);
  res.json({ message: "Member deleted" });
});

module.exports = router;
