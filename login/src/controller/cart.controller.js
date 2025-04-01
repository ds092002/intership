const jwt = require("jsonwebtoken");
const CartModel = require("../model/cart.model");
const UserModel = require("../model/socialMedia.model");
const ProductModel = require("../model/product.model");
require("dotenv").config();

exports.addToCart = async (req, res) => {
    try {
        const { quantity = 1, cartItem, ipAddress } = req.body;
        let userId = null;

        const authorization = req.headers["authorization"];
        if (authorization && authorization.startsWith("Bearer ")) {
            const token = authorization.split(" ")[1];
            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                userId = decoded.userId;
            } catch (err) {
                return res.status(401).json({ message: "Unauthorized: Invalid token" });
            }
        }

        if (!userId && !ipAddress) {
            return res.status(400).json({ message: "IP address is required for guest users" });
        }

        const product = await ProductModel.findById(cartItem).select("name price description");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let userDetails = null;
        if (userId) {
            userDetails = await UserModel.findById(userId).select("userName email");
        }

        const existingCart = await CartModel.findOne({
            cartItem: cartItem,
            isDelete: false,
            ...(userId ? { user: userId } : { ipAddress: ipAddress })
        }); 

        if (existingCart) {
            existingCart.quantity += quantity;
            existingCart.totalPrice = existingCart.quantity * product.price;
            await existingCart.save();
 
            return res.status(200).json({
                message: "Cart updated: Quantity increased",
                userId: userId,
                cart: existingCart
            });
        } else {
            const newCart = new CartModel({
                user: userId || null,
                ipAddress: userId ? null : ipAddress,
                cartItem: product._id,
                productName: product.name,
                price: product.price,
                description: product.description,
                quantity: quantity,
                totalPrice: product.price * quantity,
                userName: userDetails ? userDetails.userName : "Guest",
                email: userDetails ? userDetails.email : null,
            });

            await newCart.save();

            return res.status(201).json({
                message: "Item added to cart successfully",
                userId: userId,
                cart: newCart
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
};

exports.listingCart = async (req, res) => {
    try {
        let userId = null;
        let ipAddress = req.body.ipAddress;

        const authorization = req.headers["authorization"];
        if (authorization && authorization.startsWith("Bearer ")) {
            const token = authorization.split(" ")[1];
            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                userId = decoded.userId;
                // console.log("User ID from token:", userId);
            } catch (error) {
                return res.status(401).json({ message: "Unauthorized: Invalid token" });
            }
        }

        if (!userId && !ipAddress) {
            return res.status(400).json({ message: "User ID or IP address is required" });
        }
        
        // console.log(userId);
        // console.log(ipAddress);
    
        const cartItems = await CartModel.find({
            isDelete: false,
            $or: [
                { user: userId },
                { ipAddress: ipAddress } 
            ]
        }).populate("cartItem", "name price description");

        console.log(cartItems);
        return res.status(200).json({
            message: "Cart items fetched successfully",
            cart: cartItems
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
};
