const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");

const Order = require("../models/order-model");
const Cart = require("../models/cart-model");
const Errors = require("../errors");
const orderUtils = require("../utils/order-utils");

exports.getAllOrders = async (req, res, next) => {
  const orders = await Order.find({});

  res.status(StatusCodes.OK).json({ count: orders.length, orders });
};

exports.getCurrentUserOrders = async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(StatusCodes.OK).json({ count: orders.length, orders });
};

exports.getSingleOrder = async (req, res, next) => {
  const orderId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Errors.BadRequestError(`Invalid order id: ${orderId}`);
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Errors.NotFoundError(`Order with ID (${orderId}) does not exist`);
  }

  res.status(StatusCodes.OK).json({ order });
};

exports.createOrder = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "products.product"
    );

    if (cart === null) {
      throw new Errors.BadRequestError("No cart associated with user");
    }

    if (cart.products.length === 0) {
      throw new Errors.BadRequestError("No items within the cart");
    }

    // Calculate total price
    const totalAmount = cart.products.reduce((accumulator, cartItem) => {
      const price = parseInt(cartItem.product.price);
      const quantity = parseInt(cartItem.quantity);
      return accumulator + price * quantity;
    }, 0);

    // Create an order in the database
    const order = await Order.create({
      items: cart.products,
      totalAmount,
      user: req.user.id,
    });

    // Create a Stripe checkout session with a client reference ID
    const session = await stripe.checkout.sessions.create({
      client_reference_id: order._id, // Attach the order ID as the client reference ID
      payment_method_types: ["card"],
      line_items: orderUtils.createLineItems(cart.products),
      mode: "payment",
      success_url: "http://localhost:3000/success.html", // TODO: Replace this with URL of server once published
    });

    // Empty the cart
    cart.products = [];
    await cart.save();

    // The Stripe sessionId can be used on the client-side to initiate
    // the Stripe checkout process, which will redirect the user to
    // the Stripe hosted checkout page to complete the payment.
    res.status(StatusCodes.CREATED).json({ order, sessionId: session.id });
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Errors.InternalServerError(
      "An error occurred while creating the order."
    );
  }
};

// TODO: Use Stripe webhooks to update status of order once user has paid
// This is also accessible manually for Admin users
exports.updateOrder = async (req, res, next) => {
  res.send("updateOrder");
};
