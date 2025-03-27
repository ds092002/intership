const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    mobileNo: {
        type: Number,
        unique: true,
        match: /^[0-9]{10}$/
    },
    password: {
        type: String,
        required: true,
    },
    userName: {
        type: String
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    isDelete: {
        type: Boolean,
        default: false
    },
},
{
    versionKey : false,
    timestamps: true
});

module.exports = mongoose.model('user', userSchema);

