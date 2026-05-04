import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage({ setToken, setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (isLogin) {
        const res = await axios.post(`${API_BASE_URL}/users/login`, {
          email,
          password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        alert("Login successful!");
        navigate("/dashboard");
        return;
      }

      if (!emailRegex.test(email.trim())) {
        alert("Please enter a valid email address in the correct format.");
        return;
      }

      await axios.post(`${API_BASE_URL}/users/register`, {
        name,
        email: email.trim(),
        password,
      });

      alert("Account created successfully! You can now log in.");
      setIsLogin(true);
      setPassword("");
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <p className="section-tag">Neighborhood reading network</p>
        <h1>Share shelves, borrow stories, and keep reading moving.</h1>
        <p className="auth-copy">
          Build a local book-sharing community where readers can discover titles,
          borrow them, and read borrowed books directly from their profile.
        </p>
        <div className="auth-highlights">
          <span>Borrow tracking</span>
          <span>Reader profile</span>
          <span>In-app reading</span>
        </div>
      </section>

      <section className="login-container">
        <p className="section-tag">{isLogin ? "Welcome back" : "New to BookCircle"}</p>
        <h2>{isLogin ? "Sign in to continue" : "Create your reader account"}</h2>

        {!isLogin ? (
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : null}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>

        <p className="auth-switch">
          {isLogin ? "Do not have an account?" : "Already have an account?"}{" "}
          <span onClick={() => setIsLogin((current) => !current)}>
            {isLogin ? "Register here" : "Login here"}
          </span>
        </p>
      </section>
    </div>
  );
}

export default LoginPage;
