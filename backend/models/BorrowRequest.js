const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    borrowerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "returned"],
      default: "approved",
    },
    borrowDate: { type: Date, default: Date.now },
    returnDate: { type: Date },
    dueDate: { type: Date },
    returnedAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("BorrowRequest", borrowSchema);
