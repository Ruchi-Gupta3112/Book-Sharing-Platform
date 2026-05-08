import React, { useState } from "react";

const helpSteps = [
  {
    id: "account",
    title: "1. Create your account",
    content:
      "Start on the login page. New users can register with a name, email address, and password. Returning users can sign in and go directly to the dashboard.",
  },
  {
    id: "browse",
    title: "2. Explore the shared library",
    content:
      "Use the dashboard to browse all books currently available in the platform. You can search by title, author, genre, or description and quickly see how many copies of each title are currently available.",
  },
  {
    id: "borrow",
    title: "3. Borrow a book",
    content:
      "Each available book card includes a return date calendar and a Borrow Book button. Pick a date starting from today, then borrow one copy of the title. The available copy count immediately goes down for the next user.",
  },
  {
    id: "profile",
    title: "4. Read from your profile",
    content:
      "Every borrowed book appears in My Profile automatically. Open the Read now button to view the reading content inside the app, or use the external reading link if one has been added for that book.",
  },
  {
    id: "return",
    title: "5. Return when finished",
    content:
      "When you finish reading, open My Profile and click Return book. This adds one copy back into the available inventory so another user can borrow it.",
  },
  {
    id: "admin",
    title: "6. Add books from the admin panel",
    content:
      "Use the Admin Panel to add books with title, author, genre, description, owner information, copy count, reading content, and optional reading links. If the same title is added again, the system increases the number of copies instead of creating a separate duplicate entry.",
  },
];

function Help() {
  const [openSection, setOpenSection] = useState("account");

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="help-container">
      <p className="section-tag">How it works</p>
      <h2>Use BookCircle with confidence, even if it is your first time.</h2>
      <p className="help-lead">
        This guide walks users through the full flow of the app, from creating
        an account to borrowing, reading, and returning books. If someone opens
        the app for the first time, this page should be enough to get them started.
      </p>

      <section className="help-grid">
        <div className="help-summary-card">
          <h3>Quick Start</h3>
          <ul className="help-list">
            <li>Register or log in.</li>
            <li>Open the dashboard and search for a book.</li>
            <li>Select a valid return date and borrow it.</li>
            <li>Check the available copy count before borrowing.</li>
            <li>Go to My Profile to read the borrowed book.</li>
            <li>Return it when you are done.</li>
          </ul>
        </div>

        <div className="help-summary-card">
          <h3>What each page does</h3>
          <ul className="help-list">
            <li>`Dashboard`: browse, search, view copy counts, and borrow books.</li>
            <li>`My Profile`: view borrowed books, read them, and return them.</li>
            <li>`Admin Panel`: add new books, copy counts, and reading content.</li>
            <li>`Help`: learn how the platform works step by step.</li>
          </ul>
        </div>
      </section>

      <div className="help-accordion">
        {helpSteps.map((step) => (
          <div key={step.id} className="help-section">
            <h3 onClick={() => toggleSection(step.id)}>{step.title}</h3>
            {openSection === step.id ? <p>{step.content}</p> : null}
          </div>
        ))}
      </div>

      <section className="help-summary-card help-tips">
        <h3>Helpful Notes</h3>
        <ul className="help-list">
          <li>If a title has multiple copies, only one copy is reduced per borrow action.</li>
          <li>A title becomes fully unavailable only when all copies are borrowed.</li>
          <li>The return date cannot be set earlier than the current borrowing date.</li>
          <li>Books with reading content can be opened directly inside the profile page.</li>
          <li>If an admin adds the same title again, the system increases the available copy count instead of rejecting it.</li>
        </ul>
      </section>
    </div>
  );
}

export default Help;
