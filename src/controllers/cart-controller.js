const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");

const Cart = require("../models/cart-model");
const User = require("../models/user-model");
const Product = require("../models/product-model");
const Errors = require("../errors");
const authUtils = require("../utils/auth-utils");
const cartUtils = require("../utils/cart-utils");

const isAuthorizedForCartOperations = (user, cartUserId) => {
  if (authUtils.isSuperuser(user.role) || cartUserId.equals(user.id)) {
    return true;
  }

  return false;
};

const getCart = async (user) => {
  const cart = await Cart.findOne({ user: user.id });

  if (!cart) {
    throw new Errors.BadRequestError(`No cart associated with user`);
  }

  return cart;
};

exports.getCart = async (req, res, next) => {
  const cart = await getCart(req.user);

  res.status(StatusCodes.OK).json({ cart });
};

exports.getCartWithId = async (req, res, next) => {
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
    throw new Errors.UnauthorizedError(
      `Unauthorized to perform operations on this cart`
    );
  }

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
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Errors.BadRequestError("Invalid product id provided");
  }

  const validProduct = await Product.findById(productId);
  if (!validProduct) {
    throw new Errors.BadRequestError("Invalid product id provided");
  }

  // Get cart
  const cart = await getCart(req.user);

  // Check if product is already present in cart
  if (cartUtils.doesCartContainProduct(cart, productId)) {
    throw new Errors.BadRequestError("Product already in cart");
  }

  // Create a new cart item
  const cartItem = {
    product: productId,
    quantity: req.body.quantity || 1,
  };

  // Add the cart item to the cart
  cart.products.push(cartItem);

  try {
    await cart.save();
    res.status(StatusCodes.OK).json({ cart });
  } catch (err) {
    throw new Error(err);
  }
};

exports.updateProductQuantity = async (req, res, next) => {
  const newProductQuantity = req.body.quantity;
  const { productId } = req.params;

  cartUtils.checkForValidQuantity(newProductQuantity);

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Errors.BadRequestError("Invalid product id provided");
  }

  const validProduct = await Product.findById(productId);
  if (!validProduct) {
    throw new Errors.BadRequestError("Invalid product id provided");
  }

  // Get cart
  const cart = await getCart(req.user);

  // Check if product is not in cart
  if (!cartUtils.doesCartContainProduct(cart, productId)) {
    throw new Errors.BadRequestError("Product not present in cart");
  }

  // Update quantity
  cartUtils.updateProductQuantity(cart, productId, newProductQuantity);

  try {
    await cart.save();
    res.status(StatusCodes.OK).json({ cart });
  } catch (err) {
    throw new Error(err);
  }
};

exports.removeProductFromCart = async (req, res, next) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Errors.BadRequestError("Invalid product id provided");
  }

  const validProduct = await Product.findById(productId);
  if (!validProduct) {
    throw new Errors.BadRequestError("Invalid product id provided");
  }

  // Get cart
  const cart = await getCart(req.user);

  // Check if product is not in cart
  if (!cartUtils.doesCartContainProduct(cart, productId)) {
    throw new Errors.BadRequestError("Product not present in cart");
  }

  // Remove product from cart
  cart.products = cart.products.filter(
    (cartItem) => !cartItem.product.equals(productId)
  );

  try {
    await cart.save();
    res.status(StatusCodes.OK).json({ cart });
  } catch (err) {
    throw new Error(err);
  }
};

exports.clearCart = async (req, res, next) => {
  // Get cart
  const cart = await getCart(req.user);

  // Remove all elements from cart
  cart.products = [];

  try {
    await cart.save();
    res.status(StatusCodes.OK).json({ cart });
  } catch (err) {
    throw new Error(err);
  }
};
