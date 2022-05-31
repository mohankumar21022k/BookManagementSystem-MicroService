
//basic testing script
// describe('starting testing',function(){
//     it('should two number added correctly',function(){
//         const num1 =2;
//         const num2=3;
//         expect(num1+num2).to.equal(5);
//     });
//     it('should not give a result of 6',function(){
//         const num1 =2;
//         const num2=3;
//         expect(num1+num2).not.to.equal(6);
//     });
// });

const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const auth = require('../middleware/authorize');

describe('Authorize middleware', function() {
  it('Should throw an error if no authorization header is present', function() {
    const req = {
      get: function(headerName) {
        return null;
      }
    };
    expect(auth.bind(this, req, {}, () => {})).to.throw(
      'Not authenticated.'
    );
  });

  it('Should throw an error if the authorization header is only one string', function() {
    const req = {
      get: function(headerName) {
        return 'xyz';
      }
    };
    expect(auth.bind(this, req, {}, () => {})).to.throw();
  });

  it('Token must have userId encoded into it', function() {
    const req = {
      get: function(headerName) {
        return 'Bearer qwdjwal23jlckjac';
      }
    };
    sinon.stub(jwt, 'verify');
    jwt.verify.returns({ userId: 'abc' });
    auth(req, {}, () => {});
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abc');
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });

  it('Token verification failed error', function() {
    const req = {
      get: function(headerName) {
        return 'Bearer xyz';
      }
    };
    expect(auth.bind(this, req, {}, () => {})).to.throw();
  });
});



