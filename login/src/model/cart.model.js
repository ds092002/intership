const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Social-Media",
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    cartItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    productName: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    totalPrice:{
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
    },
    userName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("cart", cartSchema);
