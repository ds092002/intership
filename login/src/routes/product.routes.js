const express = require('express');
const productRoutes = express.Router();
const {
    addNewProduct,
    deleteProduct,
    updateProduct
} = require('../controller/product.controller');
const {
    userVerifyToken
} = require('../helpers/userVerifyToken');

productRoutes.post('/addProduct', addNewProduct);
productRoutes.put('/updateProduct', userVerifyToken, updateProduct);
productRoutes.delete('/deleteProduct', userVerifyToken, deleteProduct);


module.exports = productRoutes;