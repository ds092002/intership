const mongoose = require('mongoose');

const socialMedaiSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    google_id: {
        type: String,
    },
    facebook_id: {
        type: String,
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

module.exports = mongoose.model('Social-Media', socialMedaiSchema);

