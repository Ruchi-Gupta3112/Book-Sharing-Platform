import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

function UserProfile({ user }) {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [stats, setStats] = useState({
    activeBorrows: 0,
    currentlyReading: 0,
    overdue: 0,
  });
  const [selectedBook, setSelectedBook] = useState(null);
  const [profileUser, setProfileUser] = useState(user);

  const loadProfile = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/users/${userId}/profile`);
      setBorrowedBooks(res.data.borrowedBooks);
      setStats(res.data.stats);
      setProfileUser(res.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleReturnBook = async (requestId) => {
    try {
      await axios.post(`${API_BASE_URL}/borrow/${requestId}/return`);
      if (selectedBook?._id === requestId) {
        setSelectedBook(null);
      }
      await loadProfile();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to return book right now.");
    }
  };

  return (
    <div className="profile-container">
      <section className="profile-hero">
        <div>
          <p className="section-tag">Reader profile</p>
          <h2>{profileUser?.name || "Reader"}&apos;s bookshelf</h2>
          <p className="section-copy">
            Track what you have borrowed, open any borrowed title to read, and
            return books when you are done so they can circulate back into the community.
          </p>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <strong>{stats.activeBorrows}</strong>
            <span>Borrowed now</span>
          </div>
          <div className="stat-card">
            <strong>{stats.currentlyReading}</strong>
            <span>Ready to read</span>
          </div>
          <div className="stat-card">
            <strong>{stats.overdue}</strong>
            <span>Need return soon</span>
          </div>
        </div>
      </section>

      <div className="section-heading">
        <h3>My borrowed books</h3>
        <p>Every borrowed book appears here with a reading option.</p>
      </div>

      <div className="books-container">
        {borrowedBooks.length === 0 ? (
          <div className="empty-state">
            <h3>No books borrowed yet</h3>
            <p>Head to the dashboard to borrow a title and it will appear here instantly.</p>
          </div>
        ) : (
          borrowedBooks.map((req) => (
            <div key={req._id} className="book-card">
              <h3>{req.bookId?.title}</h3>
              <p className="book-meta">by {req.bookId?.author}</p>
              <p className="book-description">
                {req.bookId?.description || "Borrowed from your community shelf."}
              </p>

              <div className="profile-book-details">
                <span>Borrowed on {new Date(req.borrowDate).toLocaleDateString()}</span>
                <span>
                  Return by{" "}
                  {req.returnDate ? new Date(req.returnDate).toLocaleDateString() : "Flexible"}
                </span>
              </div>

              <div className="card-actions">
                <button onClick={() => setSelectedBook(req)}>Read now</button>
                <button className="secondary-button" onClick={() => handleReturnBook(req._id)}>
                  Return book
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedBook ? (
        <div className="reader-overlay" onClick={() => setSelectedBook(null)}>
          <div className="reader-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reader-header">
              <div>
                <p className="section-tag">Now reading</p>
                <h3>{selectedBook.bookId?.title}</h3>
                <p className="book-meta">by {selectedBook.bookId?.author}</p>
              </div>
              <button className="close-button" onClick={() => setSelectedBook(null)}>
                Close
              </button>
            </div>

            {selectedBook.bookId?.readUrl ? (
              <a
                className="reader-link"
                href={selectedBook.bookId.readUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open external reading link
              </a>
            ) : null}

            <div className="reader-content">
              {selectedBook.bookId?.readContent ||
                "No reading content has been added for this title yet."}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default UserProfile;
