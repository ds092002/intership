const express = require('express');
const SocialMediaLoginRoutes = express.Router();
const {
    socialMediaLogin
} = require('../controller/socialMediaLogin.controller');

SocialMediaLoginRoutes.post('/registerOrLoginUser', socialMediaLogin);

module.exports = SocialMediaLoginRoutes;