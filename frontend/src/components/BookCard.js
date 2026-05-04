import React from "react";
import { Tooltip } from "react-tooltip";

function BookCard({ book }) {
  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p>
        <strong>Author:</strong> {book.author}
      </p>
      <p>
        <strong>Genre:</strong> {book.genre}
      </p>

      <button data-tip="Click to borrow this book">Borrow</button>

      <Tooltip place="top" type="dark" effect="solid" />
    </div>
  );
}

export default BookCard;
