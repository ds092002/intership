const UserServices = require('../service/socialMedia.service');
const userService = new UserServices();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.socialMediaLogin = async (req, res) => {
    try {
        const { email, password, userName, facebook_id, google_id, photo } = req.body;

        if (!email) {
            return res.status(400).json({ message: `Email is required.` });
        }

        let loginType = google_id ? "google" : facebook_id ? "facebook" : "normal";

        let user = await userService.getUser({ email, isDelete: false });

        if (!user) {
            if (!password) {
                return res.status(400).json({ message: "Password is required for new users." });
            }

            const hashPassword = await bcryptjs.hash(password, 10);

            let newUser = {
                email,
                userName: userName || email.split('@')[0],
                password: hashPassword
            };

            if (google_id) newUser.google_id = google_id;
            if (facebook_id) newUser.facebook_id = facebook_id;

            user = await userService.addNewUser(newUser);

            return res.status(201).json({
                user: {
                    _id: user._id,
                    email: user.email,
                    userName: user.userName,
                    loginType,
                    ...(user.google_id && { google_id: user.google_id }),
                    ...(user.facebook_id && { facebook_id: user.facebook_id }),
                    photo: user.photo,
                },
                message: `User registered successfully with ${loginType}`
            });
        } else {
            if (google_id || facebook_id) {
                if (google_id && user.google_id !== google_id) {
                    return res.status(400).json({ message: "Google ID does not match." });
                }
                if (facebook_id && user.facebook_id !== facebook_id) {
                    return res.status(400).json({ message: "Facebook ID does not match." });
                }
            }else {
                if (!password) {
                    return res.status(400).json({ message: "Password is required for login" });
                }

                let checkPassword = await bcryptjs.compare(password, user.password);

                if (!checkPassword) {
                    return res.status(400).json({ message: "Incorrect password. Please try again." });
                }
            }

            let token = jwt.sign(
                { userId: user._id, loginType },
                process.env.SECRET_KEY
            );
            const hashPassword = await bcryptjs.hash(password, 10);

            res.status(200).json({
                user: {
                    _id: user._id,
                    email: user.email,
                    ...(user.google_id && { google_id: user.google_id }),
                    ...(user.facebook_id && { facebook_id: user.facebook_id }),
                    userName: user.userName,
                    photo: user.photo,
                    // password : hashPassword,
                    loginType
                },
                token,
                message: `Login successfully with ${loginType}`
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error... ${error.message}` });
    }
};
