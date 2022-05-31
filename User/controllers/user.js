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
        res
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

//User signUp
exports.signUp = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .json({
                message: errors.array()[0].msg
            })
    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const exUser = await User.findOne({ email: email });
        if (exUser) {
            return res
                .status(422)
                .json({
                    message: 'User with this email-id exists. Take Please try with different email-id'
                })
        }

        const hashedPw = await bcrypt.hash(password, 12);
        const user = new User({
            name: name,
            email: email,
            password: hashedPw,
            role: 'user',
            userAccess: true,
            fav: { books: [] }
        });
        await user.save();
        res.
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
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            return res
                .status(422)
                .json({
                    message: 'Password incorrect'
                })
        }
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
        res
            .status(200)
            .json({
                token: token,
                userId: currentUser._id.toString(),
                role: currentUser.role,
                userAccess: currentUser.userAccess
            });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

//Fetching a single user
exports.getUser = async (req, res, next) => {
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
        res
            .status(200)
            .json({
                message: 'User fetched!', user: user
            });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

//Updating the user
exports.updateUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return res
            .status(422)
            .json({
                message: errors.array()[0].msg
            })
    }
    const userId = req.params.userId;
    const name = req.body.name
    const password = req.body.password;
    const role = req.body.role;
    const userAccess = req.body.userAccess
    // const fav = req.body.fav
    try {

        const hashedPw = await bcrypt.hash(password, 12);
        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ message: 'User Not Found' })
        }
        user.name = name;

        user.password = hashedPw;
        user.role = role;
        user.userAccess = userAccess;
        // user.fav = fav;
        const result = await user.save();
        res
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

    const user = await User.findById(req.userId);
    if (!user) {
        const error = new Error('Login First');
        error.statusCode = 422;
        throw error;
    }
    let bookIdsToFetch = "";
    user.fav.books=[];
    user.fav.books.forEach(book => {
        console.log(book)
        bookIdsToFetch += book.bookId + ',';

    })
    bookIdsToFetch = bookIdsToFetch.slice(0, -1)
    try {
        if (bookIdsToFetch !== '') {
            const authHeader = req.get('Authorization');
            if (!authHeader) {
                const error = new Error('Not authenticated.');
                error.statusCode = 401;
                throw error;
            }
            const fetchedBooks = await ax('http://localhost:3001/qbooks?id=' + bookIdsToFetch, {
                headers: { Authorization: authHeader }
            })
            console.log(fetchedBooks.data)
            return res.status(200).json({ message: 'Fetched Books fron book service', fetchedBooks: fetchedBooks.data.books })
        }
        else {
            return res.status(200).json({ message: 'No Favs' });
        }
    }
    catch (err) {
        if (!err.statusCode) {
            console.log(err)
            err.statusCode = 500;
        }
    }
};

//adding book to fav
exports.postFav = async (req, res, next) => {
    const user = await User.findById(req.userId);
    const bookId = req.params.bookId;
    try {
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
            user.fav.books.push({ bookId: bookId })
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
    const user = await User.findById(req.userId);
    const bookId = req.params.bookId;
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