const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Simulate a promise for asynchronous behavior
const simulatePromise = (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(data), 100); // Simulate a delay
    });
};

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Register the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Task 10: Get the book list available in the shop (Promise Callbacks)
public_users.get('/', (req, res) => {
    simulatePromise(books)
        .then((bookData) => {
            const booksString = JSON.stringify(bookData, null, 2); // Pretty-print with 2-space indentation
            res.status(200).send(booksString);
        })
        .catch((error) => {
            res.status(500).json({ message: "Error fetching book list", error: error.message });
        });
});

// Task 11: Get book details based on ISBN (Promise Callbacks)
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    simulatePromise(books)
        .then((bookData) => {
            if (bookData[isbn]) {
                res.status(200).json(bookData[isbn]);
            } else {
                res.status(404).json({ message: "Book not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ message: "Error fetching book details", error: error.message });
        });
});

// Task 12: Get book details based on author (Promise Callbacks)
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();
    simulatePromise(books)
        .then((bookData) => {
            const filteredBooks = Object.values(bookData).filter(book => book.author.toLowerCase() === author);
            if (filteredBooks.length > 0) {
                res.status(200).json(filteredBooks);
            } else {
                res.status(404).json({ message: "No books found by this author" });
            }
        })
        .catch((error) => {
            res.status(500).json({ message: "Error fetching book details by author", error: error.message });
        });
});

// Task 13: Get book details based on title (Promise Callbacks)
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    simulatePromise(books)
        .then((bookData) => {
            const filteredBooks = Object.values(bookData).filter(book => book.title.toLowerCase() === title);
            if (filteredBooks.length > 0) {
                res.status(200).json(filteredBooks);
            } else {
                res.status(404).json({ message: "No books found with this title" });
            }
        })
        .catch((error) => {
            res.status(500).json({ message: "Error fetching book details by title", error: error.message });
        });
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    simulatePromise(books)
        .then((bookData) => {
            if (bookData[isbn]) {
                res.status(200).json(bookData[isbn].reviews);
            } else {
                res.status(404).json({ message: "Book not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ message: "Error fetching book reviews", error: error.message });
        });
});

module.exports.general = public_users;
