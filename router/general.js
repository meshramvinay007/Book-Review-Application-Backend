const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const fs = require("fs");

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push({ username, password });
      res.send("User successfully registered. Now you can login.");
    } else {
      res.status(404).json({ message: "User already exists!" });
    }
  } else {
    res.send(404).json({ message: "Failed to register user." });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  fs.readFile(__dirname + "/booksdb.js", "utf-8", (err, data) => {
    if (err) {
      res.status(404).json({ message: "Failed to fetch books." });
    } else {
      res.send({ books });
    }
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  fs.readFile(__dirname + "/booksdb.js", "utf-8", (err, data) => {
    if (err) {
      res.status(404).json({ message: "Failed to fetch books." });
    } else {
      if (books[isbn]) {
        res.send(books[isbn]);
      } else {
        res.status(404).json({ message: "Enter valid ISBN" });
      }
    }
  });
});

public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  fs.readFile(__dirname + "/booksdb.js", "utf-8", (err, data) => {
    if (err) {
      res.status(404).json({ message: "Failed to fetch books." });
    } else {
      const booksbyauthor = Object.keys(books)
        .map((book) => books[book])
        .filter((book) => book.author.toLowerCase() === author.toLowerCase());
      res.send({ booksbyauthor });
    }
  });
});

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  fs.readFile(__dirname + "/booksdb.js", "utf-8", (err, data) => {
    if (err) {
      res.status(404).json({ message: "Failed to fetch books." });
    } else {
      const booksbytitle = Object.keys(books)
        .map((book) => books[book])
        .filter((book) => book.title.toLowerCase() === title.toLowerCase());
      res.send({ booksbytitle });
    }
  });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  fs.readFile(__dirname + "/booksdb.js", "utf-8", (err, data) => {
    if (err) {
      res.status(404).json({ message: "Failed to fetch books." });
    } else {
      if (books[isbn]) {
        const reviews = books[isbn].reviews;
        res.send(reviews);
      } else {
        res.send({});
      }
    }
  });
});

module.exports.general = public_users;
