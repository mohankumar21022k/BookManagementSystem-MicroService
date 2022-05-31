module.exports = (req, res, next) => {
    if (req.role !== "admin") {
        const error = new Error('Admin Access only');
        error.statusCode = 422;
        throw error;
      }
 next();
    }
