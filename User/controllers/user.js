const Book = require('../models/book');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ax = require('axios')

//Fetching Users
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res
            .status(200)
            .json({
                message: 'Fetched Users Successfully!!',
                users: users
            });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

//Fetching a single user
exports.getUser = async (req, res, next) => {

    //capturing the parameter from the url 
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({
                    message: 'User Not Found'
                })
        }
        return res
            .status(200)
            .json({
                message: 'User fetched!', user: user
            });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

//User signUp
exports.signUp = async (req, res, next) => {

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
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role; // choosing role ,admin or user while signing up
    try {
        const exUser = await User.findOne({ email: email });
        if (exUser) {
            return res
                .status(422)
                .json({
                    message: 'User with this email-id exists. Take Please try with different email-id'
                })
        }
        //using bcryptjs package to create hashed password with 12 salt
        const hashedPw = await bcrypt.hash(password, 12);
        const user = new User({
            name: name,
            email: email,
            password: hashedPw,
            role: role,
            userAccess: true,
            fav: { books: [] }
        });
        await user.save();
        return res.
            status(201)
            .json({
                message: 'User created successfully!',
                user: user
            });

    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};

//Authorization
exports.login = async (req, res, next) => {

    //getting data from the request body
    const email = req.body.email;
    const password = req.body.password;
    let currentUser;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res
                .status(422)
                .json({
                    message: 'User with this email Not Found! Try signing up'
                })
        }
        currentUser = user;
        //comparing the hashed password and user entered password
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            return res
                .status(422)
                .json({
                    message: 'Password incorrect'
                })
        }
        //signing the token with the properties mentioned below 
        const token = jwt.sign(
            {
                email: currentUser.email,
                userId: currentUser._id.toString(),
                role: currentUser.role,
                userAccess: currentUser.userAccess
            },
            'libapp005567',
            { expiresIn: '10h' }
        );
        return res
            .status(200)
            .json({
                token: token,
                userId: currentUser._id.toString(),
                role: currentUser.role,
                userAccess: currentUser.userAccess
            });
       
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
        return err;
    }

};

//Updating the user
exports.updateUser = async (req, res, next) => {

    //capturing validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return res
            .status(422)
            .json({
                message: errors.array()[0].msg
            })
    }

    //capturing the parameter from the url 
    const userId = req.params.userId;

    //getting data from the request body
    const name = req.body.name
    const password = req.body.password;
    const role = req.body.role;
    const userAccess = req.body.userAccess

    try {
        //hashing the password with 12 salt
        const hashedPw = await bcrypt.hash(password, 12);
        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ message: 'User Not Found' })
        }

        //updating the user with inputs
        user.name = name;
        user.password = hashedPw;
        user.role = role;
        user.userAccess = userAccess;
        const result = await user.save();
        return res
            .status(200)
            .json({
                message: 'User Info updated!', user: result
            });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

//User Deleting
exports.deleteUser = async (req, res, next) => {

    //capturing the parameter from the url 
    const userId = req.params.userId;
    try {
        const user = await User.findByIdAndRemove(userId);
        if (!user) {
            return res
                .status(404)
                .json({
                    message: 'User not found '
                });
        }
        res
            .status(201)
            .json({
                message: "User deleted successfully!",
                name: user.userName
            });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

//fetching fav
exports.getFav = async (req, res, next) => {

    //finding the user by id in DB
    const user = await User.findById(req.userId);
    if (!user) {
        const error = new Error('Login First');
        error.statusCode = 422;
        next(error);
    }

    //creating a string of bookid's in fav property
    let bookIdsToFetch = "";

    //looping through the fav property of a user
    user.fav.books.forEach(book => {
        console.log(book)
        bookIdsToFetch += book.bookId + ',';

    })

    //eliminating ',' if only one book is present in the fav property
    bookIdsToFetch = bookIdsToFetch.slice(0, -1)
    try {
        //Authorization and authenticated
        if (bookIdsToFetch !== '') {
            const authHeader = req.get('Authorization');
            if (!authHeader) {
                const error = new Error('Not authenticated.');
                error.statusCode = 401;
                throw error;
            }

            //sending request to the book service along with the ids
            const fetchedBooks = await ax('http://localhost:3001/qbooks?id=' + bookIdsToFetch, {
                headers: { Authorization: authHeader }
            })
            //fetched books data from book service 
            console.log(fetchedBooks.data)
            return res.status(200).json({ message: 'Fetched Books fron book service', fetchedBooks: fetchedBooks.data.books })
        }
        else {
            return res.status(200).json({ message: 'No Favs' });
        }
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

//adding book to fav
exports.postFav = async (req, res, next) => {

    //finding the user by id in DB
    const user = await User.findById(req.userId);
    if (!user) {
        const error = new Error('Login First');
        error.statusCode = 422;
        next(error);
    }

    //capturing the parameter from the url 
    const bookId = req.params.bookId;

    try {

        //checking whether the bookid which is passed is already in fav
        const dupfavBook = user.fav.books.find(currentBook => {
            return currentBook.bookId.toString() === bookId.toString();
        })
        console.log(dupfavBook);
        if (dupfavBook) {
            return res
                .status(422)
                .json({
                    message: 'Book already in fav'
                })
        }
        else {
            user.fav.books.push({ bookId: bookId }) //pushing the bookid to fav property
            user.save().then(result => {
                console.log(result)
            })
            return res
                .status(201)
                .json({
                    message: 'Added book to fav!'
                });
        }
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

//deleting book from fav
exports.postFavDeleteBook = async (req, res, next) => {

    //finding the user by id in DB
    const user = await User.findById(req.userId);
    if (!user) {
        const error = new Error('Login First');
        error.statusCode = 422;
        next(error);
    }

    //capturing the parameter from the url 
    const bookId = req.params.bookId;

    //capturing the ids except for the id passed as the parameter and saving the remaining ids as fav
    const updatedFavBooks = user.fav.books.filter(item => {
        return item.bookId.toString() !== bookId.toString();
    });
    user.fav.books = updatedFavBooks;
    return user.save()
        .then(result => {
            return res
                .status(201)
                .json({
                    message: 'Book removed from favorites!'
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};