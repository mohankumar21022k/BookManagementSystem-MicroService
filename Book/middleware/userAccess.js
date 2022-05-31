module.exports = (req, res, next) => {
    if (req.userAccess !== true) {
        const error = new Error('Access has been disabled. Please contact the admin to initiate revoking');
        error.statusCode = 422;
        throw error;
    }
    next();
}