const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "books.json");

app.use(express.json());

let books = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

function saveBooks() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(books, null, 2), "utf8");
}

function validBook(body) {
    return body
        && typeof body.title === "string"
        && body.title.trim().length > 0
        && typeof body.author === "string"
        && body.author.trim().length > 0
        && typeof body.price === "number"
        && Number.isFinite(body.price)
        && body.price >= 0;
}

// GET: return all books
app.get("/books", (req, res) => {
    return res.status(200).json(books);
});

// GET: return one book by ID
app.get("/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(item => item.id === id);

    if (!Number.isInteger(id) || !book) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book);
});

// POST: create a book
app.post("/books", (req, res) => {
    if (!validBook(req.body)) {
        return res.status(400).json({
            message: "title and author must be non-empty strings; price must be a non-negative number"
        });
    }

    const newId = books.length
        ? Math.max(...books.map(book => book.id)) + 1
        : 1;

    const newBook = {
        id: newId,
        title: req.body.title.trim(),
        author: req.body.author.trim(),
        price: req.body.price
    };

    books.push(newBook);
    saveBooks();

    return res.status(201).json(newBook);
});

// PUT: update a book
app.put("/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(item => item.id === id);

    if (!Number.isInteger(id) || !book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!validBook(req.body)) {
        return res.status(400).json({
            message: "title and author must be non-empty strings; price must be a non-negative number"
        });
    }

    book.title = req.body.title.trim();
    book.author = req.body.author.trim();
    book.price = req.body.price;

    saveBooks();
    return res.status(200).json(book);
});

// DELETE: delete a book
app.delete("/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex(item => item.id === id);

    if (!Number.isInteger(id) || index === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    const [deletedBook] = books.splice(index, 1);
    saveBooks();

    return res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook
    });
});

// Helpful route for checking that the server is running
app.get("/", (req, res) => {
    res.status(200).json({ message: "Book Management API is running" });
});

// Handle malformed JSON request bodies
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({ message: "Invalid JSON request body" });
    }
    return next(err);
});

app.listen(PORT, () => {
    console.log(`Book Management API running at http://localhost:${PORT}`);
});
