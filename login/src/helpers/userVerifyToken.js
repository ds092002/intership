const jwt = require('jsonwebtoken');
const User = require('../model/socialMedia.model');
require('dotenv').config();
exports.userVerifyToken = async (req, res, next) => {
    try {
        const authorization = req.headers['authorization'];
        if (!authorization) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const token = authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        let decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded.userId) {
            return res.status(401).json({ message: 'Invalid token: User ID missing' });
        }

        let user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Invalid User Token' });
        }

        req.user = user;

        // console.log("User Verified:", req.user); 

        next();
    } catch (error) {
        console.error('Token Verification Error:', error);
        res.status(403).json({ message: 'Invalid Token' });
    }
};


