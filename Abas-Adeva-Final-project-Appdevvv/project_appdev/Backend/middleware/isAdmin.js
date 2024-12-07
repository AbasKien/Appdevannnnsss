// Middleware to check if user is admin
module.exports = (req, res, next) => {
    if (!req.session || !req.session.userId || req.session.role !== 'admin') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Admin access required'
        });
    }
    next();
};
