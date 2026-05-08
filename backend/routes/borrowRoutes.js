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

    const activeBorrowsForTitle = await BorrowRequest.find({
      bookId: book._id,
      status: { $ne: "returned" },
    }).select("borrowerId");

    const existingActiveBorrow = activeBorrowsForTitle.find(
      (borrow) => String(borrow.borrowerId) === String(userId),
    );

    if (existingActiveBorrow) {
      return res.status(400).json({
        message: "You have already borrowed this title and must return it before borrowing another copy",
      });
    }

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

    if (availableCopies <= 0) {
      return res.status(400).json({ message: "No copies are currently available" });
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

    book.totalCopies = totalCopies;
    book.availableCopies = Math.max(availableCopies - 1, 0);
    book.isBorrowed = book.availableCopies === 0;
    book.available = book.availableCopies > 0;
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
      const parsedReturnTotalCopies = Number(borrowRequest.bookId.totalCopies);
      const totalCopies =
        Number.isFinite(parsedReturnTotalCopies) && parsedReturnTotalCopies > 0
          ? parsedReturnTotalCopies
          : 1;
      const parsedCurrentAvailableCopies = Number(
        borrowRequest.bookId.availableCopies,
      );
      const currentAvailableCopies = Math.min(
        Math.max(
          Number.isFinite(parsedCurrentAvailableCopies)
            ? parsedCurrentAvailableCopies
            : 0,
          0,
        ),
        totalCopies,
      );
      borrowRequest.bookId.availableCopies = Math.min(
        currentAvailableCopies + 1,
        totalCopies,
      );
      borrowRequest.bookId.isBorrowed = borrowRequest.bookId.availableCopies === 0;
      borrowRequest.bookId.available = borrowRequest.bookId.availableCopies > 0;
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
