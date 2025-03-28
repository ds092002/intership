const UserServices = require('../service/socialMedia.service');
const userService = new UserServices();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.socialMediaLogin = async (req, res) => {
    try {
        let { email, password, userName, facebook_id, google_id, photo, login_Type } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        let loginType = login_Type || (google_id ? "google" : facebook_id ? "facebook" : "normal");
        let user = await userService.getUser({ email });

        let updatedFields = {};
        let message = "";

        if (user) {
            if (
                (loginType === "google" && user.facebook_id) ||
                (loginType === "facebook" && user.google_id) ||
                (loginType === "normal" && (user.google_id || user.facebook_id))
            ) {
                return res.status(400).json({ message: "This email is already registered with a different login method. Please use the correct login method." });
            }

            if (loginType === "normal") {
                if (!password) {
                    return res.status(400).json({ message: "Password is required for login." });
                }
                const checkPassword = await bcryptjs.compare(password, user.password);
                if (!checkPassword) {
                    return res.status(400).json({ message: "Incorrect password. Please try again." });
                }
                message = "Login successful with normal.";
            } else if (loginType === "google") {
                if (user.google_id) {
                    if (user.google_id !== google_id) {
                        return res.status(400).json({ message: "Google ID does not match this account." });
                    }
                    message = "Login successful with Google.";
                } else {
                    updatedFields = { google_id, facebook_id: null, loginType: "google" };
                    message = "User is now registered with Google.";
                }
            } else if (loginType === "facebook") {
                if (user.facebook_id) {
                    if (user.facebook_id !== facebook_id) {
                        return res.status(400).json({ message: "Facebook ID does not match this account." });
                    }
                    message = "Login successful with Facebook.";
                } else {
                    updatedFields = { facebook_id, google_id: null, loginType: "facebook" };
                    message = "User is now registered with Facebook.";
                }
            }

            if (login_Type === "google" || login_Type === "facebook") {
                if (!password) {
                    password = user?.password || null;
                }
            }

            if (Object.keys(updatedFields).length > 0) {
                await userService.updateUser(user._id, updatedFields);
                Object.assign(user, updatedFields);
                return res.status(200).json({
                    user: {
                        _id: user._id,
                        email: user.email,
                        userName: user.userName,
                        photo: user.photo,
                        loginType,
                        google_id: user.google_id,
                        facebook_id: user.facebook_id
                    },
                    message
                });
            }

            const token = jwt.sign({ userId: user._id, loginType }, process.env.SECRET_KEY);
            return res.status(200).json({
                user: {
                    _id: user._id,
                    email: user.email,
                    userName: user.userName,
                    photo: user.photo,
                    loginType,
                    google_id: user.google_id,
                    facebook_id: user.facebook_id
                },
                token,
                message
            });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required for new users." });
        }

        const hashPassword = await bcryptjs.hash(password, 10);
        let newUser = {
            email,
            userName: userName || email.split('@')[0],
            password: hashPassword,
            loginType,
            photo,
            google_id: google_id || null,
            facebook_id: facebook_id || null
        };

        user = await userService.addNewUser(newUser);

        return res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                userName: user.userName,
                loginType,
                photo: user.photo,
                google_id: user.google_id,
                facebook_id: user.facebook_id
            },
            message: `User registered successfully with ${loginType}`
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error... ${error.message}` });
    }
};
