const Book = require('../models/book');
const { validationResult } = require('express-validator');

//Fetching books
exports.getBooks = async (req, res, next) => {

  const currentPage = req.query.page || 1;  //default page 1
  const perPage = 8;    //8 books per page
  try {
    const totalItems = await Book
      .find()
      .countDocuments();
    const books = await Book.find()

      //pagination
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    if (!books) {
      return res
        .status(404)
        .json({
          message: 'Books Not Found'
        })
    }

    return res
      .status(200)
      .json({
        message: 'Fetched Books Successfully!!',
        books: books,
        totalItems: totalItems
      });
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Fetching info about single book
exports.getBook = async (req, res, next) => {

  //capturing parameters from url
  const bookId = req.params.bookId;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({
          message: 'Book Not Found'
        })
    }
    return res
      .status(200)
      .json({
        message: 'Book fetched!',
        book: book
      });
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Creating book 
exports.createBook = async (req, res, next) => {

  //capturing validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({
        message: errors.array()[0].msg
      })
  }

  //getting data from the request body
  const title = req.body.title;
  const authors = req.body.authors;
  const average_rating = req.body.average_rating;
  const isbn = req.body.isbn;
  const isbn13 = req.body.isbn13;
  const language_code = req.body.language_code;
  const num_pages = req.body.num_pages;
  const ratings_count = req.body.ratings_count;
  const text_reviews_count = req.body.text_reviews_count;
  const publication_date = req.body.publication_date;
  const publisher = req.body.publisher;

  //creating book
  try {
    const book = new Book({
      title: title,
      authors: authors,
      average_rating: average_rating,
      isbn: isbn,
      isbn13: isbn13,
      language_code: language_code,
      num_pages: num_pages,
      ratings_count: ratings_count,
      text_reviews_count: text_reviews_count,
      publication_date: publication_date,
      publisher: publisher,
    })

    await book.save();
    const books = await Book.find();
    return res.status(201).json({
      message: 'Book Added successfully!',
      books: books
    });
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Updating the book info
exports.updateBook = async (req, res, next) => {

  //capturing validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({
        message: errors.array()[0].msg
      })
  }

  //capturing parameters from url
  const bookId = req.params.bookId;

  //getting data from the request body
  const title = req.body.title;
  const authors = req.body.authors;
  const average_rating = req.body.average_rating;
  const isbn = req.body.isbn;
  const isbn13 = req.body.isbn13;
  const language_code = req.body.language_code;
  const num_pages = req.body.num_pages;
  const ratings_count = req.body.ratings_count;
  const text_reviews_count = req.body.text_reviews_count;
  const publication_date = req.body.publication_date;
  const publisher = req.body.publisher;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({
          message: 'Book Not Found'
        })
    }

    //updating the book
    book.title = title;
    book.authors = authors;
    book.average_rating = average_rating;
    book.isbn = isbn;
    book.isbn13 = isbn13;
    book.language_code = language_code;
    book.num_pages = num_pages;
    book.ratings_count = ratings_count;
    book.text_reviews_count = text_reviews_count;
    book.publication_date = publication_date;
    book.publisher = publisher;
    const result = await book.save();
    return res
      .status(200)
      .json({
        message: 'Book updated!',
        book: result
      });
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Deleting Book from DB
exports.deleteBook = async (req, res, next) => {

  //capturing parameters from url
  const bookId = req.params.bookId;

  try {
    const book = await Book.findByIdAndRemove(bookId);
    if (!book) {
      return res
        .status(404)
        .json({
          message: 'Book not found'
        });
    }
    return res
      .status(201)
      .json({
        message: "Book deleted successfully!",
        name: book.title
      });
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

}

//searching book
exports.searchBook = async (req, res, next) => {

  const filters = req.query.search;
  //adding filters through query
  try {
    const books = await Book.find({
      "$or": [
        { title: { $regex: filters, $options: 'i' } },
        { authors: { $regex: filters, $options: 'i' } },
        { isbn: { $regex: filters, $options: 'i' } },
        { publisher: { $regex: filters, $options: 'i' } }
      ]
    });
    return res
      .status(200)
      .json({
        filteredBooks: books
      });
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Sending favs
exports.queryedBooks = async (req, res, next) => {

  let ids = req.query.id;
  try {
    if (ids) {
      if (ids.trim()) {
        ids = ids.split(',')
        const book = await Book.find({ _id: ids });
        return res.status(200).json({ message: "Books sent to the user services", books: book })
      }
    }
    else {
      return res.status(404).json({ message: 'Books not found' })
    }
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};