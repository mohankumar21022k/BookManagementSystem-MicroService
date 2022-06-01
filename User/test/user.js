const expect = require('chai').expect;
const sinon = require('sinon');
const userController = require('../controllers/user');
const User = require('../models/user');

describe('User Controller', function () {
    describe('UserController-login', function () {
        it('Should throws an error with code 500 if accessing the database fails', function (done) {
            sinon.stub(User, 'findOne');
            User.findOne.throws();
            const req = {
                body: {
                    email: 'test@test.com',
                    password: 'tester'
                }
            };
            userController.login(req, {}, () => { }).then(result => {
                // console.log(result);
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();
            });
            User.findOne.restore();
        });

        it('Should throw an error with code 404 if finding user does not exist in db', function () {
            sinon.stub(User, 'findOne');
            User.findOne.throws();
            const req = {
                body: {
                    email: 'test@test.com',
                    password: 'tester',
                }
            };
            userController.login(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 404);
            });
            User.findOne.restore();
        })
    });

    describe('Fetch Users', function () {
        it('Should return an error with code 500 if admin is logged in and failed to get response from db', function () {
            sinon.stub(User, 'find');
            User.find.throws();
            const req = {
                body: {
                    role: 'admin'
                }
            };
            userController.getUsers(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
            });
            User.find.restore();
        })
    });


    describe('Fetch User', function () {
        it('Should return an error with code 500 if db connection failed', function () {
            sinon.stub(User, 'findById');
            User.findById.throws();
            const req = {
                body: {
                    _id: 'badusbdwjndkwfn'
                }
            };
            userController.getUser(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
            });
            User.findById.restore();
        });
        it('Should return an error with code 404 if user does not exist', function () {
            sinon.stub(User, 'findById');
            User.findById.throws();
            const req = {
                body: {
                    _id: 'badusbdwjndkwfn'
                }
            };
            userController.getUser(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 404);
            });
            User.findById.restore();
        })
    });


    describe('User update', function () {
        it('Should throw an error with code 500 if user is not updated in db', function () {
            sinon.stub(User, 'findById');
            User.findById.throws();
            const req = {
                body: {
                    email: 'test@test.com',
                    password: 'tester',
                    userName: 'tester',
                    role: 'role',
                    userAccess: true
                }
            };
            userController.updateUser(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
            });
            User.findById.restore();
        })
        it('Should throws an error with code 404 if user is not find in db', function () {
            sinon.stub(User, 'findById');
            User.findById.throws();
            const req = {
                body: {
                    email: 'test@test.com',
                    password: 'tester',
                    userName: 'tester'
                }
            };
            userController.updateUser(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 404);
            });
            User.findById.restore();
        })
    });
    describe('Delete User', function () {
        it('Should throw an error with code 500 if user is not deleted from db', function () {
            sinon.stub(User, 'findByIdAndRemove');
            User.findByIdAndRemove.throws();
            const req = {
                body: {
                    _id: 'abcdefgighk'
                }
            };
            userController.deleteUser(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
            });
            User.findByIdAndRemove.restore();
        });
        it('Should throw an error code with 404 if user does not exist in db', function () {
            sinon.stub(User, 'findByIdAndRemove');
            User.findByIdAndRemove.throws();
            const req = {
                body: {
                    _id: 'abcdefgighk'
                }
            };
            userController.deleteUser(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 404);
            });
            User.findByIdAndRemove.restore();
        })
    });
});