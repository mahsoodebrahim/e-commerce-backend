const Errors = require("../errors");

exports.doesCartContainProduct = (cart, productId) => {
  for (const cartProduct of cart.products) {
    const cartProductId = cartProduct.product;
    if (cartProductId.equals(productId)) {
      return true;
    }
  }
  return false;
};

exports.checkForValidQuantity = (quantity) => {
  // Check if the 'quantity' property exists
  if (quantity === null || typeof quantity === "undefined") {
    // 'quantity' is not present in the request body
    throw new Errors.BadRequestError("Quantity not provided in request body");
  }

  // Check if 'quantity' is a number or can be converted to a number
  if (!isNaN(quantity)) {
    // At this point, 'quantity' is a valid number, including zero
    return;
  } else {
    // 'quantity' is not a valid number
    throw new Errors.BadRequestError("Quantity is not a valid number");
  }
};

exports.updateProductQuantity = (cart, productId, newQuantity) => {
  for (const cartProduct of cart.products) {
    const cartProductId = cartProduct.product;
    if (cartProductId.equals(productId)) {
      cartProduct.quantity = newQuantity;
      break;
    }
  }
  return cart;
};
