const express = require("express");
const path = require("path");

const port = process.env.PORT;
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.static(path.join(__dirname, "..")));

const db = new sqlite3.Database("portfolio.db");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  db.run(
    "INSERT INTO messages (name,email,message) VALUES (?,?,?)",
    [name, email, message],
    function (err) {
      if (err) {
        console.error(err);
        return res.send("Couldn't save your message");
      }
      res.send("Message saved successfully");
    },
  );
});

app.listen(port, () => console.log(`server is running on port ${port}`));
