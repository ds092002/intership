const CartModel = require("../model/cart.model");
const UserModel = require("../model/socialMedia.model"); // Import User model
const ProductModel = require('../model/product.model')

module.exports = class CartServices {
  // Add to Cart
  async addToCart(body) {
    try {
      // Find user by ID to get userName
      const user = await UserModel.findById(body.user);
      if (!user) {
        throw new Error("User not found");
      }

      const cartData = {
        user: body.user,
        userName: user.userName, // Auto-fill userName
        product: user.product,
        cartItem: body.cartItem,
        quantity: body.quantity || 1,
      };

      return await CartModel.create(cartData);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // Get Cart with Populated User & CartItem
  async getCart(query) {
    try {
      return await CartModel.findOne(query)
        .populate("user", "userName email") // Populate user info
        .populate("cartItem");
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getCartById(cartId) {
    try {
      return await CartModel.findById(cartId)
        .populate("cartItem")
        .populate("user", "userName email"); // Fetch userName directly
    } catch (error) {
      console.log(error);
      return error;
    }
  }
};
