const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const nodemailer = require("nodemailer");
require("dotenv").config();
const session = require("express-session");

const app = express();
const port = process.env.PORT || 8000;

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key", // keep it secret in .env
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// SQLite
const db = new sqlite3.Database("portfolio.db", (err) => {
  if (err) console.error("DB Connection Error:", err);
  else console.log("Connected to portfolio.db");
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// -------------------- AUTH --------------------
let isLoggedIn = false;

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send("All fields are required");
  }

  const createdAt = new Date().toISOString();

  db.run(
    "INSERT INTO messages (name, email, message, created_at) VALUES (?, ?, ?, ?)",
    [name, email, message, createdAt],
    function (err) {
      if (err) {
        console.error("DB Insert Error:", err);
        return res.status(500).send("Failed to save message");
      }
      res.send("Message saved successfully");
    },
  );
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "ntec2026") {
    req.session.user = { username };
    return res.sendFile(path.join(__dirname, "public", "dashboard.html"));
  }
  res.send("Invalid credentials");
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

// -------------------- DASHBOARD --------------------
app.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/login.html");
  res.sendFile(path.join(__dirname, "../dashboard.html"));
});
app.get("/api/messages", (req, res) => {
  db.all("SELECT * FROM messages ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json([]);
    res.json(rows);
  });
});
app.post("/delete", (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).send("Missing message id");

  db.run("DELETE FROM messages WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).send("Failed to delete message");
    res.send("Message deleted successfully");
  });
});

// -------------------- REPLY --------------------
app.post("/reply", (req, res) => {
  const { email, reply } = req.body;
  if (!email || !reply) return res.status(400).send("Missing email or reply");

  transporter.sendMail(
    {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reply from Eng Awono Fabien",
      text: reply,
    },
    (err, info) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Failed to send email");
      }
      console.log("Email sent:", info.response);
      res.send(`Reply sent to ${email} successfully`);
    },
  );
});

// -------------------- START SERVER --------------------
app.listen(port, () => console.log(`Server running on port ${port}`));
