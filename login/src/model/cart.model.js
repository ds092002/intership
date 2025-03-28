const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Social-Media",
      required: true,
    },
    userName: {
      type: String, 
    },
    email: {
      type: String,
    },
    cartItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    productName: {
      type: String,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 1,
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
