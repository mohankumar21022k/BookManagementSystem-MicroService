const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user');
const auth = require('../middleware/authorize');
const admin = require('../middleware/isAdmin');
const userAccess = require('../middleware/userAccess');



//fetching all users
router.get('/users',

    //authorization ,authentication as admin and also checks of the userAccess(i.e Enabled or Disabled)
    auth, admin, userAccess,

    //action to be done by this route
    userController.getUsers);

//signing Up
router.post('/user/signup',

    //validation
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

    //action to be done by this route
    userController.signUp);

//login
router.post('/user/login',

    //action to be done by this route
    userController.login);

//getting a particular user
router.get('/user/:userId',

    //authorization ,authentication as admin and also checks of the userAccess(i.e Enabled or Disabled)
    auth, admin, userAccess,

    //action to be done by this route
    userController.getUser);

//updating a particular user
router.put('/user/:userId',

    //authorization ,authentication as admin and also checks of the userAccess(i.e Enabled or Disabled)
    auth, admin, userAccess,

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

    //action to be done by this route
    userController.updateUser);

//deleting a particular user
router.delete('/user/:userId',

    //authorization ,authentication as admin and also checks of the userAccess(i.e Enabled or Disabled)
    auth, admin, userAccess,

    //action to be done by this route
    userController.deleteUser);

// //fetching favs
router.get('/cuser/fav',

    //authorization ,authentication as user/admin and also checks of the userAccess(i.e Enabled or Disabled)
    auth, userAccess,

    //action to be done by this route
    userController.getFav);

//posting favs
router.post('/user/fav/:bookId',

    //authorization ,authentication as user/admin and also checks of the userAccess(i.e Enabled or Disabled)
    auth, userAccess,

    //action to be done by this route
    userController.postFav);

//deleting favs
router.post('/user/fav-delete/:bookId',

    //authorization ,authentication as user/admin and also checks of the userAccess(i.e Enabled or Disabled)
    auth, userAccess,

    //action to be done by this route
    userController.postFavDeleteBook);

module.exports = router;