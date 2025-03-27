const express = require('express');
const UserRoutes = express.Router();
const {
    registerOrLoginUser
} = require('../controller/user.controller');

UserRoutes.post('/registerOrLoginUser', registerOrLoginUser);

module.exports = UserRoutes;