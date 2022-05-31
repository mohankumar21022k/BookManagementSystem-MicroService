module.exports = (req, res, next) => {

  //checking for role in request object
  if (req.role !== "admin") {
    const error = new Error('Admin Access only');
    error.statusCode = 422;
    throw error;
  }
  next();
}