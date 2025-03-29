const jwt = require("jsonwebtoken");
const User = require("../model/socialMedia.model");
require("dotenv").config();

exports.userVerifyToken = async (req, res, next) => {
    try {
        const authorization = req.headers["authorization"];

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Unauthorized: Token expired" });
            } else {
                return res.status(403).json({ message: "Invalid Token" });
            }
        }

        if (!decoded.userId) {
            return res.status(401).json({ message: "Invalid token: User ID missing" });
        }

        let user = await User.findById(decoded.userId).select("-password"); // Exclude password

        if (!user) {
            return res.status(401).json({ message: "Invalid User Token" });
        }

        req.user = user; // Attach user to request object

        next(); // Move to the next middleware
    } catch (error) {
        console.error("Token Verification Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
