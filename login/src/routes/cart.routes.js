const express = require("express");
const cartRoutes = express.Router();
const { 
    addToCart,
    listingCart
} = require("../controller/cart.controller");
const { userVerifyToken } = require("../helpers/userVerifyToken");

cartRoutes.post('/addToCart', addToCart);
cartRoutes.get('/listingCart', listingCart);

module.exports = cartRoutes; 
