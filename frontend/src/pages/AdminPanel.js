import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const initialForm = {
  title: "",
  author: "",
  genre: "",
  description: "",
  ownerName: "",
  language: "English",
  pageCount: "",
  publishedYear: "",
  readUrl: "",
  readContent: "",
};

function AdminPanel({ user }) {
  const [form, setForm] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleAddBook = async () => {
    try {
      await axios.post(`${API_BASE_URL}/books`, {
        ...form,
        ownerName: form.ownerName || user?.name || "Community Member",
        pageCount: Number(form.pageCount) || 0,
        publishedYear: Number(form.publishedYear) || undefined,
      });

      alert("Book added successfully!");
      setForm(initialForm);
    } catch (err) {
      alert(err.response?.data?.message || "Error adding book.");
    }
  };

  return (
    <div className="dashboard-container">
      <section className="hero-panel">
        <div>
          <p className="section-tag">Catalog management</p>
          <h2>Grow the shared library with richer book details.</h2>
          <p className="section-copy">
            Add descriptions, reading content, and ownership details so borrowed
            books are useful the moment someone opens them from their profile.
          </p>
        </div>
      </section>

      <div className="admin-form">
        <input
          type="text"
          name="title"
          placeholder="Book title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={form.genre}
          onChange={handleChange}
        />
        <input
          type="text"
          name="ownerName"
          placeholder="Owner or donor name"
          value={form.ownerName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="language"
          placeholder="Language"
          value={form.language}
          onChange={handleChange}
        />
        <input
          type="number"
          name="pageCount"
          placeholder="Page count"
          value={form.pageCount}
          onChange={handleChange}
        />
        <input
          type="number"
          name="publishedYear"
          placeholder="Published year"
          value={form.publishedYear}
          onChange={handleChange}
        />
        <input
          type="text"
          name="readUrl"
          placeholder="Optional external reading URL"
          value={form.readUrl}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Short description"
          value={form.description}
          onChange={handleChange}
        />
        <textarea
          name="readContent"
          placeholder="Paste chapter text, notes, or an excerpt so borrowers can read inside their profile"
          value={form.readContent}
          onChange={handleChange}
        />
        <button onClick={handleAddBook}>Add Book</button>
      </div>
    </div>
  );
}

export default AdminPanel;
