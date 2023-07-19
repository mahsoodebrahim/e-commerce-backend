const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");

const Cart = require("../models/cart-model");
const User = require("../models/user-model");
const Product = require("../models/product-model");
const Errors = require("../errors");
const authUtils = require("../utils/auth-utils");

const isAuthorizedForCartOperations = (user, cartUserId) => {
  if (authUtils.isSuperuser(user.role) || cartUserId.equals(user.id)) {
    return true;
  }

  return false;
};

const getCart = async (req) => {
  const { cartId } = req.params;

  // Check for valid cart ID
  if (!mongoose.Types.ObjectId.isValid(cartId)) {
    throw new Errors.BadRequestError("Invalid cart id provided");
  }

  const cart = await Cart.findById(cartId);

  if (!cart) {
    throw new Errors.BadRequestError(`Cart with ID ${cart} does not exist`);
  }

  if (!isAuthorizedForCartOperations(req.user, cart.user)) {
    throw new Errors.BadRequestError(
      `Unauthorized to perform operations on this cart`
    );
  }

  return cart;
};

exports.getCart = async (req, res, next) => {
  const cart = await getCart(req);

  res.status(StatusCodes.OK).json({ cart });
};

exports.createCart = async (req, res, next) => {
  const userId = req.user.id;

  // Check if user already has cart associated with them
  const existingCart = await Cart.findOne({ user: userId });
  if (!!existingCart) {
    throw new Errors.BadRequestError("Cart already created for this user");
  }

  const cart = await Cart.create({ user: userId });

  res.status(StatusCodes.OK).json({ cart });
};

exports.addProductToCart = async (req, res, next) => {
  // const { productId } = req.params;

  // if (!mongoose.Types.ObjectId.isValid(productId)) {
  //   throw new Errors.BadRequestError("Invalid product id provided");
  // }

  // const validProduct = await Product.findById(productId);
  // if (!validProduct) {
  //   throw new Errors.BadRequestError("Invalid product id provided");
  // }

  // getCart();

  res.send("addProductToCart");
};

exports.updateProductQuantity = async (req, res, next) => {
  res.send("updateProductQuantity");
};

exports.removeProductFromCart = async (req, res, next) => {
  res.send("removeProductFromCart");
};

exports.clearCart = async (req, res, next) => {
  res.send("clearCart");
};
