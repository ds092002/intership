const express = require("express");
const cartRoutes = express.Router();
const { 
    addToCart,
    mergeGuestCart
} = require("../controller/cart.controller");
const { userVerifyToken } = require("../helpers/userVerifyToken");

cartRoutes.post('/addToCart', addToCart);
cartRoutes.post('/mergeGuestCart', userVerifyToken, mergeGuestCart);

module.exports = cartRoutes;
