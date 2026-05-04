const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BorrowRequest = require("../models/BorrowRequest");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      "secretkey",
      { expiresIn: "1h" },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/:userId/borrowed", async (req, res) => {
  try {
    const borrowRequests = await BorrowRequest.find({
      borrowerId: req.params.userId,
      status: { $ne: "returned" },
    })
      .populate("bookId")
      .sort({ borrowDate: -1 });

    res.status(200).json(borrowRequests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching borrowed books", error: error.message });
  }
});

router.get("/:userId/profile", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "name email role createdAt",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const borrowedBooks = await BorrowRequest.find({
      borrowerId: req.params.userId,
      status: { $ne: "returned" },
    })
      .populate("bookId")
      .sort({ borrowDate: -1 });

    const stats = {
      activeBorrows: borrowedBooks.length,
      currentlyReading: borrowedBooks.filter(
        (item) => item.bookId?.readContent || item.bookId?.readUrl,
      ).length,
      overdue: borrowedBooks.filter(
        (item) =>
          item.returnDate &&
          new Date(item.returnDate).getTime() < Date.now(),
      ).length,
    };

    res.status(200).json({ user, borrowedBooks, stats });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
});

module.exports = router;
