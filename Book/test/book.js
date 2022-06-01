const expect = require('chai').expect;
const bookController = require('../controllers/book');
const Book = require('../models/book');
const sinon = require('sinon');

describe('Book Controller', function () {
    describe('Fetch Books', function () {
        it('Should throw an error 500 if request fails to get response', function () {
            sinon.stub(Book, 'find');
            Book.find.throws();
            const req = {
                body: {
                    _id: 'qwhndaergfsd'
                }
            };
            bookController.getBooks(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
            });
            Book.find.restore();
        });
        it('Should throw an error with code 404 if no books found', function () {
            sinon.stub(Book, 'find');
            Book.find.throws();
            const req = {
                body: {
                    _id: 'fdsfdifgw4insn'
                }
            };
            bookController.getBooks(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 404);
            });
            Book.find.restore();
        });
    });
    describe('Fetch Book', function () {
        it('Should throw an error 500 if request fails to get response', function () {
            sinon.stub(Book, 'findById');
            Book.findById.throws();
            const req = {
                body: {
                    _id: 'oefnsljvfjlj3sdf'
                }
            };
            bookController.getBook(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
            });
            Book.findById.restore();
        });
        it('Should throw an error with code 404 if no books found', function () {
            sinon.stub(Book, 'findById');
            Book.findById.throws();
            const req = {
                body: {
                    _id: 'askvnsljerlknef22'
                }
            };
            bookController.getBook(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 404);
            });
            Book.findById.restore();
        });
    });
    describe('Update Book', function () {
        it('Should throw an error 500 if request fails to get response', function () {
            sinon.stub(Book, 'findById');
            Book.findById.throws();
            const req = {
                body: {
                    _id: 'abbddbhsdbsf',
                    title: 'title',
                    authors: 'authors',
                    average_rating: 'average_rating',
                    isbn: 'isbn',
                    isbn13: 'isbn13',
                    language_code: 'language_code',
                    num_pages: 'num_pages',
                    ratings_count: 'ratings_count',
                    text_reviews_count: 'text_reviews_count',
                    publication_date: 'publication_date',
                    publisher: 'publisher'

                }
            };
            bookController.updateBook(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
            });
            Book.findById.restore();
        });
        it('Should throw an error with code 404 if no book found', function () {
            sinon.stub(Book, 'findById');
            Book.findById.throws();
            const req = {
                body: {
                    _id: 'abbddbhsdbsf'
                }
            };
            bookController.updateBook(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 404);
            });
            Book.findById.restore();
        });
    });
    describe('Delete Book', function () {
        it('Should throw an error 500 if request fails to get response', function () {
            sinon.stub(Book, 'findByIdAndRemove');
            Book.findByIdAndRemove.throws();
            const req = {
                body: {
                    _id: 'abbddbhsdbsf'
                }
            };
            bookController.deleteBook(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
            });
            Book.findByIdAndRemove.restore();
        });
        it('Should throw an error with code 404 if no book found', function () {
            sinon.stub(Book, 'findByIdAndRemove');
            Book.findByIdAndRemove.throws();
            const req = {
                body: {
                    _id: 'abbddbhsdbsf'
                }
            };
            bookController.deleteBook(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 404);
            });
            Book.findByIdAndRemove.restore();
        });
    });

    describe('Searching Book', function () {
        it('Should return a response - book not found in no books doesnt match the query request', function () {
            sinon.stub(Book, 'find');
            Book.find.throws();
            const req = {
                body: {

                    title: 'title',
                    authors: 'authors',
                    publisher: 'publisher',
                    isbn: 'isbn'
                }
            };
            bookController.searchBook().then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
            });
            Book.find.restore();
        });
    });
});