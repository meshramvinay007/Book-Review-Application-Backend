const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const userwithusername = users.filter((user) => user.username === username);
  if (userwithusername.length > 0) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username, password) => {
  const validUsers = users.filter(
    (user) => user.username === username && user.password === password
  );
  if (validUsers) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };

    res.send("User successfully logged in.");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization["username"];
  if (books[isbn]) {
    const reviews = { ...books[isbn].reviews, [username]: review };
    books[isbn].reviews = reviews;
    res.send(`Review for the ISBN ${isbn} has been added/updated.`);
  } else {
    res.status(404).json({ message: "Enter valid ISBN." });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization["username"];
  if (books[isbn]) {
    delete books[isbn].reviews[username];
  } else {
    res.status(404).json({ message: "Enter valid ISBN." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
