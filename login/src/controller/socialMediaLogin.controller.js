const UserServices = require('../service/socialMedia.service');
const userService = new UserServices();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.socialMediaLogin = async (req, res) => {
    try {
        const { email, password, userName, facebook_id, google_id, photo } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        let loginType = google_id ? "google" : facebook_id ? "facebook" : "normal";
        let user = await userService.getUser({ email });

        if (user) {
            if (google_id) {
                if (user.google_id !== google_id) {
                    return res.status(400).json({ message: "Google ID does not belong to this account. Please check your Google ID and email." });
                }
            } else if (facebook_id) {
                if (user.facebook_id !== facebook_id) {
                    return res.status(400).json({ message: "Facebook ID does not belong to this account. Please check your Facebook ID and email." });
                }
            } else {
                if (user.userName !== userName) {
                    return res.status(400).json({ message: "Please check the email or username. This email is already registered." });
                }
                if (!password) {
                    return res.status(400).json({ message: "Password is required for login." });
                }
                let checkPassword = await bcryptjs.compare(password, user.password);
                if (!checkPassword) {
                    return res.status(400).json({ message: "Incorrect password. Please try again." });
                }
            }

            let token = jwt.sign({ userId: user._id, loginType }, process.env.SECRET_KEY, { expiresIn: "7d" });

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
                message: `Login successful with ${loginType}`
            });
        } 

        if (!password && !google_id && !facebook_id) {
            return res.status(400).json({ message: "Password is required for new users." });
        }

        const hashPassword = password ? await bcryptjs.hash(password, 10) : null;

        let newUser = {
            email,
            userName: userName || email.split('@')[0],
            password: hashPassword,
            loginType,
            photo
        };

        if (google_id) newUser.google_id = google_id;
        if (facebook_id) newUser.facebook_id = facebook_id;

        user = await userService.addNewUser(newUser);
        
        console.log(newUser);
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
