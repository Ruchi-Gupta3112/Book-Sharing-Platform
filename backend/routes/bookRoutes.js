const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to fetch books", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const cleanedTitle = req.body.title?.trim();

    if (!cleanedTitle) {
      return res.status(400).json({ message: "Book title is required" });
    }

    const existingBook = await Book.findOne({
      title: {
        $regex: `^${cleanedTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    });

    if (existingBook) {
      return res.status(400).json({
        message: "This book title has already been added to the platform",
      });
    }

    const book = new Book({
      ...req.body,
      title: cleanedTitle,
    });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Unable to add book", error: error.message });
  }
});

module.exports = router;
