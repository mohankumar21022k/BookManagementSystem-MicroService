const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bookController = require('../controllers/book');
const auth = require('../middleware/authorize');
const admin = require('../middleware/isAdmin');


//fetching all books
router.get('/books', bookController.getBooks);

//querying route
router.get('/qbooks', bookController.queryedBooks);

//search 
router.get('/book', bookController.searchBook);

//creating book
router.post('/book', auth, admin,
    [body('isbn')
        .trim()
        .isLength({ min: 9 })
        .withMessage('Enter valid isbn with 9 digits!'),
    body('isbn13')
        .trim()
        .isLength({ min: 13 })
        .withMessage('Enter valid isbn with 13 digits!'),
    body('average_rating')
        .isDecimal({ min: 1, max: 5 })
        .withMessage('Must be a decimal from 1.0-5.0!'),
    body('language_code')
        .isLength({ max: 6 }),
    body('num_pages')
        .isNumeric()
        .withMessage('Must be a number!'),
    body('ratings_count')
        .isNumeric()
        .withMessage('Must be a number!'),
    body('text_reviews_count')
        .isNumeric()
        .withMessage('Must be a number!'),
    body('publication_date')
        .isDate()
        .withMessage('Must be a date!'),
    body('publisher')
        .not()
        .isEmpty()
        .withMessage('Publisher must not be empty')
    ],

    bookController.createBook);

//getting a particular book
router.get('/book/:bookId', auth, bookController.getBook);

//updating a particular book
router.put('/book/:bookId', auth, admin,
    [body('isbn')
        .trim()
        .isLength({ min: 9 }),
    body('isbn13')
        .trim()
        .isLength({ min: 13 })
        .withMessage('Enter valid isbn with 13 digits!'),
    body('average_rating')
        .isDecimal({ min: 1, max: 5 }),
    body('language_code')
        .isLength({ max: 6 }),
    body('num_pages')
        .isNumeric(),
    body('ratings_count')
        .isNumeric(),
    body('text_reviews_count')
        .isNumeric(),
    body('publication_date')
        .isDate(),
    body('publisher')
        .not()
        .isEmpty()
        .withMessage('Publisher must not be empty')
    ],

    bookController.updateBook);

//deleting a particular book
router.delete('/book/:bookId', auth, admin, bookController.deleteBook);

module.exports = router;