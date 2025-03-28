const mongoose = require('mongoose');

const productModel = mongoose.Schema({
    id:{
        type: String,
    },
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    description : {
        type : String
    },
    isDelete: {
        type: Boolean,
        default: false
    }
},
{
    versionKey : false,
    timestamps : true
});

module.exports = mongoose.model('products', productModel)