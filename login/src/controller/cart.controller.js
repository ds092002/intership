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
        console.log(cartItem)
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let userDetails = null;
        if (userId) {
            userDetails = await UserModel.findById(userId).select("userName email");
        }

        let cart = await CartModel.findOne({
            $or: [{ user: userId }, { ipAddress: userId ? null : ipAddress }],
            cartItem: cartItem,
            isDelete: false
        });

        if (cart) {
            cart.quantity += quantity;
            cart.totalPrice = cart.quantity * product.price;
            await cart.save();
            return res.status(200).json({ message: `Cart updated: Quantity increased`, cart });
        }

        let totalPrice = product.price * quantity;

        cart = new CartModel({
            userId: userId || null,
            ipAddress: userId ? null : ipAddress,
            cartItem: product._id,
            productName: product.name,      
            price: product.price,           
            description: product.description,
            quantity: quantity,
            totalPrice: totalPrice,
            userName: userDetails ? userDetails.userName : "Guest",
            email: userDetails ? userDetails.email : null,
        });

        await cart.save();

        return res.status(201).json({
            message: "Item added to cart successfully",
            cart
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
};

exports.mergeGuestCart = async (req, res) => {
    try {
        console.log("Request user:", req.user); 

        if (!req.user || !req.user._id) {  
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        const { _id: userId, userName, email } = req.user;
        const { ipAddress } = req.body;

        console.log("User ID:", userId);
        console.log("User Name:", userName);
        console.log("IP Address:", ipAddress);

        if (!ipAddress) {
            return res.status(400).json({ message: "IP address is required" });
        }

        const guestCartItems = await CartModel.find({ ipAddress, isDelete: false });

        if (guestCartItems.length === 0) {
            return res.status(200).json({ message: "No guest cart found" });
        }

        for (let guestItem of guestCartItems) {
            const existingCartItem = await CartModel.findOne({
                userId: userId,
                cartItem: guestItem.cartItem,
                isDelete: false
            });

            if (existingCartItem) {
                existingCartItem.quantity += guestItem.quantity;
                existingCartItem.totalPrice = existingCartItem.quantity * existingCartItem.price;
                await existingCartItem.save();
            } else {
                guestItem.userId = userId;
                guestItem.userName = userName;  
                guestItem.email = email;        
                guestItem.ipAddress = null;
                await guestItem.save();
            }
        }

        await CartModel.deleteMany({ ipAddress });

        return res.status(200).json({ message: "No items left behind! Your guest cart is now linked to your account." });
    } catch (error) { 
        console.error(error);
        res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
};