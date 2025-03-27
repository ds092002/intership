const UserServices = require('../service/user.service');
const userService = new UserServices();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register or Login a User
exports.registerOrLoginUser = async (req, res) => {
    try {
        const { email, password, userName } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: `Email and Password are required.` });
        }

        let user = await userService.getUser({ email, isDelete: false });

        if (user) {
            let checkPassword = await bcryptjs.compare(password, user.password);
            if (!checkPassword) {
                return res.status(401).json({ message: `Password is incorrect. Please enter the correct password.` });
            }

            let token = jwt.sign({ userId: user._id }, 'User');
            return res.status(200).json({ token, message: `Login Successful.. 👍🏻` });
        }
        if (!userName) {
            return res.status(400).json({ message: `userName is required for registration.` });
        }

        let hashPassword = await bcryptjs.hash(password, 10);
        user = await userService.addNewUser({
            email,
            password: hashPassword,
            userName
        });

        let token = jwt.sign({ userId: user._id }, 'User');
        res.status(201).json({ user, token, message: `New user registered successfully.. 👍🏻` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error... ${error.message}` });
    }
};
