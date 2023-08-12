const { createLineItems } = require("../../../src/utils/order-utils");

describe("createLineItems()", () => {
  test("Should return the correct line items object used for Stripe checkout session", () => {
    const testQuantity = "5",
      testName = "testName",
      testDescription = "testDescription",
      testPrice = "10",
      testImage = "http://mytestimg.png";

    const expectedQuantity = 5,
      expectedPrice = 1000,
      expectedName = testName,
      expectedDescription = testDescription,
      expectedImage = [testImage];

    const testProduct = {
      name: testName,
      description: testDescription,
      price: testPrice,
      image: testImage,
    };

    const testProducts = [{ product: testProduct, quantity: testQuantity }];

    const result = createLineItems(testProducts);

    expect(result[0].quantity).toBe(expectedQuantity);
    expect(result[0].price_data.unit_amount).toBe(expectedPrice);
    expect(result[0].price_data.product_data.name).toBe(expectedName);
    expect(result[0].price_data.product_data.description).toBe(
      expectedDescription
    );
    expect(result[0].price_data.product_data.images).toEqual(expectedImage);
  });
});
