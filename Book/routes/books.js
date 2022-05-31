const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bookController = require('../controllers/book');
const auth = require('../middleware/authorize');
const admin = require('../middleware/isAdmin');
const userAccess = require('../middleware/userAccess')

//fetching all books
router.get('/books',

    //action to be done by this route
    bookController.getBooks);

//querying route
router.get('/qbooks',

    //action to be done by this route
    bookController.queryedBooks);

//search 
router.get('/book',

//authorization ,authentication as user/admin and also checks of the userAccess(i.e Enabled or Disabled)
 auth,userAccess,

    //action to be done by this route
    bookController.searchBook);

//creating book
router.post('/book',

    //authorization ,authentication as admin and also checks of the userAccess(i.e Enabled or Disabled)
    auth, admin,userAccess,

    //validation 
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

    //action to be done by this route
    bookController.createBook);

//getting a particular book
router.get('/book/:bookId',

    //authorization ,authentication as user and also checks of the userAccess(i.e Enabled or Disabled)
    auth, userAccess,

    //action to be done by this route
    bookController.getBook);

//updating a particular book
router.put('/book/:bookId',

    //authorization ,authentication as admin and also checks of the userAccess(i.e Enabled or Disabled)
    auth, admin,userAccess,

    //validation
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

    //action to be done by this route
    bookController.updateBook);

//deleting a particular book
router.delete('/book/:bookId',

    //authorization ,authentication as admin and also checks of the userAccess(i.e Enabled or Disabled)
    auth, admin,userAccess,

    //action to be done by this route
    bookController.deleteBook);

module.exports = router;