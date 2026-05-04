import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

function Dashboard({ user }) {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [borrowSelections, setBorrowSelections] = useState({});
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  const loadBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/books`);
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const genres = [
    "All",
    ...new Set(books.map((book) => book.genre).filter(Boolean)),
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch = [
      book.title,
      book.author,
      book.genre,
      book.description,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesGenre = genreFilter === "All" || book.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const handleSelectionChange = (bookId, value) => {
    setBorrowSelections((current) => ({
      ...current,
      [bookId]: value,
    }));
  };

  const handleBorrow = async (bookId) => {
    try {
      const userId = localStorage.getItem("userId");
      const returnDate = borrowSelections[bookId];

      if (!returnDate) {
        alert("Please choose a return date before borrowing.");
        return;
      }

      const res = await axios.post(`${API_BASE_URL}/borrow/${bookId}`, {
        userId,
        returnDate,
      });

      alert(res.data.message);
      setBorrowSelections((current) => ({ ...current, [bookId]: "" }));
      await loadBooks();
    } catch (err) {
      console.error("Borrow error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error borrowing book");
    }
  };

  return (
    <div className="dashboard-container">
      <section className="hero-panel">
        <div>
          <p className="section-tag">Library dashboard</p>
          <h2>Find your next borrowed read, {user?.name || "reader"}.</h2>
          <p className="section-copy">
            Browse the shared catalog, filter by genre, and borrow books with a
            return date so the community always knows what is available.
          </p>
        </div>

        <div className="stats-strip">
          <div className="stat-card">
            <strong>{books.length}</strong>
            <span>Total books</span>
          </div>
          <div className="stat-card">
            <strong>{books.filter((book) => !book.isBorrowed).length}</strong>
            <span>Available now</span>
          </div>
          <div className="stat-card">
            <strong>
              {books.filter((book) => book.readContent || book.readUrl).length}
            </strong>
            <span>Readable in app</span>
          </div>
        </div>
      </section>

      <section className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Search by title, author, genre, or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="genre-select"
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </section>

      <div className="section-heading">
        <h3>Shared collection</h3>
        <p>
          {loading
            ? "Loading books..."
            : `${filteredBooks.length} books match your search`}
        </p>
      </div>

      <div className="books-container">
        {filteredBooks.map((book) => (
          <div key={book._id} className="book-card">
            <div className="book-card-top">
              <span
                className={`status-pill ${book.isBorrowed ? "status-pill-borrowed" : ""}`}
              >
                {book.isBorrowed ? "Borrowed" : "Available"}
              </span>
              <span className="genre-pill">{book.genre}</span>
            </div>

            <h3>{book.title}</h3>
            <p className="book-meta">by {book.author}</p>
            <p className="book-description">
              {book.description ||
                "A community-added title waiting for its next reader."}
            </p>

            <div className="book-detail-list">
              <span>{book.ownerName || "Community Member"}</span>
              <span>
                {book.pageCount ? `${book.pageCount} pages` : "Open length"}
              </span>
              <span>{book.language || "English"}</span>
            </div>

            <label className="date-label" htmlFor={`return-date-${book._id}`}>
              Return by
            </label>
            <input
              id={`return-date-${book._id}`}
              type="date"
              min={today}
              value={borrowSelections[book._id] || ""}
              onChange={(e) => handleSelectionChange(book._id, e.target.value)}
              disabled={book.isBorrowed}
            />
            <button
              onClick={() => handleBorrow(book._id)}
              disabled={book.isBorrowed}
            >
              {book.isBorrowed ? "Currently borrowed" : "Borrow book"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
