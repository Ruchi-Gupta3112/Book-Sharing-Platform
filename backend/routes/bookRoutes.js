const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    const normalizedBooks = await Promise.all(
      books.map(async (book) => {
        const parsedTotalCopies = Number(book.totalCopies);
        const totalCopies =
          Number.isFinite(parsedTotalCopies) && parsedTotalCopies > 0
            ? parsedTotalCopies
            : 1;
        const parsedAvailableCopies = Number(book.availableCopies);
        const availableCopies = Math.min(
          Math.max(
            Number.isFinite(parsedAvailableCopies)
              ? parsedAvailableCopies
              : totalCopies,
            0,
          ),
          totalCopies,
        );

        if (
          book.totalCopies !== totalCopies ||
          book.availableCopies !== availableCopies ||
          book.available !== (availableCopies > 0) ||
          book.isBorrowed !== (availableCopies === 0)
        ) {
          book.totalCopies = totalCopies;
          book.availableCopies = availableCopies;
          book.available = availableCopies > 0;
          book.isBorrowed = availableCopies === 0;
          await book.save();
        }

        return book;
      }),
    );
    res.json(normalizedBooks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to fetch books", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const cleanedTitle = req.body.title?.trim();
    const copyCount = Math.max(Number(req.body.copyCount) || 1, 1);

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
      const parsedCurrentTotalCopies = Number(existingBook.totalCopies);
      const currentTotalCopies =
        Number.isFinite(parsedCurrentTotalCopies) &&
        parsedCurrentTotalCopies > 0
          ? parsedCurrentTotalCopies
          : 1;
      const parsedCurrentAvailableCopies = Number(existingBook.availableCopies);
      const currentAvailableCopies = Math.min(
        Math.max(
          Number.isFinite(parsedCurrentAvailableCopies)
            ? parsedCurrentAvailableCopies
            : currentTotalCopies,
          0,
        ),
        currentTotalCopies,
      );

      existingBook.totalCopies = currentTotalCopies + copyCount;
      existingBook.availableCopies = currentAvailableCopies + copyCount;
      existingBook.available = existingBook.availableCopies > 0;
      existingBook.isBorrowed = existingBook.availableCopies === 0;

      existingBook.author = req.body.author?.trim() || existingBook.author;
      existingBook.genre = req.body.genre?.trim() || existingBook.genre;
      existingBook.description = req.body.description?.trim() || existingBook.description;
      existingBook.ownerName = req.body.ownerName?.trim() || existingBook.ownerName;
      existingBook.language = req.body.language?.trim() || existingBook.language;
      existingBook.pageCount = Number(req.body.pageCount) || existingBook.pageCount;
      existingBook.publishedYear =
        Number(req.body.publishedYear) || existingBook.publishedYear;
      existingBook.readUrl = req.body.readUrl?.trim() || existingBook.readUrl;
      existingBook.readContent = req.body.readContent?.trim() || existingBook.readContent;

      await existingBook.save();

      return res.status(200).json({
        message: `${copyCount} more ${copyCount === 1 ? "copy" : "copies"} added for this title`,
        book: existingBook,
      });
    }

    const book = new Book({
      ...req.body,
      title: cleanedTitle,
      totalCopies: copyCount,
      availableCopies: copyCount,
      isBorrowed: false,
      available: true,
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
