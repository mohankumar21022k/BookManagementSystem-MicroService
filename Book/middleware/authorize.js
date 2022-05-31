const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  //setting authHeader
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }

  //extracting the token
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    
    //decoding the token with the secret key signed while logging in
    decodedToken = jwt.verify(token, 'libapp005567');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }

  //storing the decoded properties to the request object
  req.userId = decodedToken.userId;
  req.role=decodedToken.role;
  req.userAccess= decodedToken.userAccess;
  next();
};
