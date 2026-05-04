const express = require("express");
const router = express.Router();
const BorrowRequest = require("../models/BorrowRequest");
const Book = require("../models/Book");

router.post("/:bookId", async (req, res) => {
  try {
    const { userId, returnDate } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User is required to borrow a book" });
    }

    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.isBorrowed) {
      return res.status(400).json({ message: "Book already borrowed" });
    }
    if (returnDate) {
      const selectedReturnDate = new Date(returnDate);
      const borrowingStartDate = new Date();
      borrowingStartDate.setHours(0, 0, 0, 0);

      if (Number.isNaN(selectedReturnDate.getTime())) {
        return res
          .status(400)
          .json({ message: "Please choose a valid return date" });
      }

      if (selectedReturnDate < borrowingStartDate) {
        return res.status(400).json({
          message: "Return date cannot be earlier than the borrowing date",
        });
      }
    }

    book.isBorrowed = true;
    book.available = false;
    await book.save();

    const borrowRequest = new BorrowRequest({
      bookId: book._id,
      borrowerId: userId,
      borrowDate: new Date(),
      returnDate,
      dueDate: returnDate ? new Date(returnDate) : undefined,
      status: "approved",
    });

    await borrowRequest.save();

    const populatedBorrow = await borrowRequest.populate("bookId");

    res.status(200).json({
      message: "Book borrowed successfully!",
      borrowRequest: populatedBorrow,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error borrowing book", error: error.message });
  }
});

router.post("/:requestId/return", async (req, res) => {
  try {
    const borrowRequest = await BorrowRequest.findById(
      req.params.requestId,
    ).populate("bookId");

    if (!borrowRequest) {
      return res.status(404).json({ message: "Borrow request not found" });
    }

    if (borrowRequest.status === "returned") {
      return res
        .status(400)
        .json({ message: "This book has already been returned" });
    }

    borrowRequest.status = "returned";
    borrowRequest.returnedAt = new Date();
    await borrowRequest.save();

    if (borrowRequest.bookId) {
      borrowRequest.bookId.isBorrowed = false;
      borrowRequest.bookId.available = true;
      await borrowRequest.bookId.save();
    }

    res.status(200).json({ message: "Book returned successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error returning book", error: error.message });
  }
});

module.exports = router;
