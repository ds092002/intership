const express = require('express');
const cartRoutes = express.Router();
const {
    addToCart
} = require('../controller/cart.controller');
const {
    userVerifyToken
} = require('../helpers/userVerifyToken');

cartRoutes.post('/addToCart', userVerifyToken, addToCart);

module.exports = cartRoutes