const CartModel = require("../model/cart.model");
const UserModel = require("../model/socialMedia.model");

module.exports = class CartServices {

  async addToCart(body) {
    try {
      const user = await UserModel.findById(body.user);
      if (!user) {
        throw new Error("User not found");
      }

      const cartData = {
        user: body.user,
        userName: user.userName,
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

  async getCart(query) {
    try {
      return await CartModel.findOne(query)
        .populate("user", "userName email") 
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
        .populate("user", "userName email");
    } catch (error) {
      console.log(error);
      return error;
    }
  }
};
