const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: { type: String, default: "General", trim: true },
    description: { type: String, default: "", trim: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ownerName: { type: String, default: "Community Member", trim: true },
    language: { type: String, default: "English", trim: true },
    pageCount: { type: Number, default: 0 },
    publishedYear: { type: Number },
    coverImage: { type: String, default: "", trim: true },
    readUrl: { type: String, default: "", trim: true },
    readContent: {
      type: String,
      default:
        "This title is available to borrow right now. Add full reading content from the admin panel so borrowers can read it inside their profile.",
    },
    isBorrowed: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Book", bookSchema);
