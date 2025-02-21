const jwt = require('jsonwebtoken');
const NoAuthRoute = require('../models/noAuthRoute');

const jwtVerify = async (req, res, next) => {
    try {
        // Check if route is in no-auth list
        const path = req.path;
        const noAuthRoute = await NoAuthRoute.findOne({ path });
        if (noAuthRoute) {
            return next();
        }

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = jwtVerify;
