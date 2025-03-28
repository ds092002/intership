const usersRoute = require('express').Router();
const socialMediaRoutes = require('./socialMedia.routes');
const productRoutes = require('./product.routes');
const cartRoutes = require('./cart.routes');

usersRoute.use('/socialMedia', socialMediaRoutes);
usersRoute.use('/product',productRoutes);
usersRoute.use('/cart', cartRoutes);

module.exports = usersRoute;