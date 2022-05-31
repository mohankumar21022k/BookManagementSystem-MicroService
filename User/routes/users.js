const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user');
const auth = require('../middleware/authorize');
const admin = require('../middleware/isAdmin');


//fetching all users
router.get('/users', userController.getUsers);

//signing Up
router.post('/user/signup',
    [body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Weak Password!'),
    body('name')
        .trim()
        .isAlpha()
        .isLength({ min: 4 })
    ],
    userController.signUp);

//Login
router.post('/user/login', userController.login);

//getting a particular user
router.get('/user/:userId', auth,admin, userController.getUser);

//updating a particular user
router.put('/user/:userId',auth,  admin,
    // [body('name')
    //     .trim()
    //     .isAlpha()
    //     .isLength({ min: 4 }),
    // body('password')
    //     .trim()
    //     .isLength({ min: 5 })
    //     .withMessage('Weak Password!'),
    // body('role')
    //     .trim()
    //     .isAlpha()
    //     .isLength({ min: 4}),
    // ],
    userController.updateUser);

// //fetching favs
router.get('/cuser/fav', auth, userController.getFav);

//posting favs
router.post('/user/fav/:bookId', auth, userController.postFav);

//deleting favs
router.post('/user/fav-delete/:bookId', auth, userController.postFavDeleteBook);

//deleting a particular user
router.delete('/user/:userId',auth, admin, userController.deleteUser);

module.exports = router;