const UserModel = require("../model/socialMedia.model");
const ProductModel = require("../model/product.model");
const CartModel = require("../model/cart.model");

exports.addToCart = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const userId = req.user._id;
    const { cartItem, quantity = 1 } = req.body;

    if (!cartItem) {
      return res.status(400).json({ message: "Product (cartItem) is required" });
    }

    // Fetch user details
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch product details
    const product = await ProductModel.findById(cartItem);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product is already in the cart
    let cart = await CartModel.findOne({
      user: userId,
      cartItem,
      isDelete: false,
    });

    if (cart) {
      cart.quantity += quantity;
      await cart.save();

      return res.status(200).json({
        message: `Cart updated: Quantity increased`,
        cart,
      });
    }

    // Create a new cart item with user and product details
    cart = new CartModel({
      user: userId,
      userName: user.userName,
      email: user.email,
      cartItem: product._id,
      productName: product.name,
      price: product.price,
      description: product.description,
      quantity,
    });

    await cart.save();

    return res.status(201).json({
      message: `Item added to cart successfully`,
      cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error... ${error.message}` });
  }
};
