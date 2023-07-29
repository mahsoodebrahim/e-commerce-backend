exports.createLineItems = (products) => {
  return products.map((product) => {
    const { name, description, price, image } = product.product;
    return {
      price_data: {
        currency: "usd", // Replace with the appropriate currency code
        unit_amount: parseInt(price) * 100, // Stripe expects the amount in cents
        product_data: {
          name: name, // Replace with the name of your product
          description: description, // Replace with the description of your product
          images: [image], // Replace with the URL of your product image
        },
      },
      quantity: parseInt(product.quantity),
    };
  });
};
