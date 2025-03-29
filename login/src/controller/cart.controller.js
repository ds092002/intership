const jwt = require("jsonwebtoken");
const CartModel = require("../model/cart.model");
const UserModel = require("../model/socialMedia.model");
const ProductModel = require("../model/product.model");
require("dotenv").config();

const getClientIP = (req) => {
    return req.headers["x-forwarded-for"] |  req.connection.remoteAddress;
};

exports.addToCart = async (req, res) => {
    try {
        const { quantity = 1, cartItem } = req.body;

        let userId = null;
        let ipAddress = getClientIP(req);

        const authorization = req.headers["authorization"];
        if (authorization && authorization.startsWith("Bearer ")) {
            const token = authorization.split(" ")[1];
            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                userId = decoded.userId;
                ipAddress = null;
            } catch (err) {
                return res.status(401).json({ message: "Unauthorized: Invalid token" });
            }
        }

        const product = await ProductModel.findById(cartItem).select("name price description");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let userDetails = null;
        if (userId) {
            userDetails = await UserModel.findById(userId).select("userName email");
        }

        let cart = await CartModel.findOne({
            $or: [{ user: userId }, { ipAddress: ipAddress }],
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
        const userId = req.user.userId;
        const ipAddress = req.ip;

        if (!userId) {
            return res.status(401).json({message: `Unauthorized user not found`})
        }

        const guestCartItems = await CartModel.find({guestIp: ipAddress, isDelete: false});

        if (guestCartItems.length === 0) {
            return res.status(200).json({message: `No guest cart found`});
        }

        const userCartItems = await CartModel.find({user: userId, isDelete: false})

        for (let guestItem of guestCartItems) {
            const existingCartItem = await CartModel.findOne({
                user: userId,
                cartItem: item.cartItem,
                isDelete: false
            });
            
            if (existingCartItem) {
                existingCartItem.quantity += item.quantity;
                existingCartItem.totalPrice = existingCartItem.quantity * existingCartItem.price;
                await existingCartItem.save();
            }else{
                item.user = userId;
                item.ipAddress = null;
                await item.save();
            }
        }
        await CartModel.deleteMany({ipAddress});

        return res.status(200).json({message : "No items left behind! Your guest cart is now linked to your account."})
    } catch (error) { 
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
}