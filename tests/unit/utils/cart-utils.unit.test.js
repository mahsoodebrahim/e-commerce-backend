const {
  Types: { ObjectId: MongooseObjectId },
} = require("mongoose");
const {
  doesCartContainProduct,
  checkForValidQuantity,
  updateProductQuantity,
} = require("../../../src/utils/cart-utils");

describe("doesCartContainProduct()", () => {
  it("Should return true if product is in cart", () => {
    const testProductIdString = "64a9d3d74ee9a5e73b7ed160";
    const testProductId = new MongooseObjectId(testProductIdString);
    const testCart = {
      products: [{ product: testProductId }],
    };

    const result = doesCartContainProduct(testCart, testProductId);

    expect(result).toBe(true);
  });

  it("Should return false if product is not in cart", () => {
    const testProductIdString1 = "64a9d3d74ee9a5e73b7ed160";
    const testProductIdString2 = "45a9d3d74ee6a4e73b7ed823";
    const testProductId1 = new MongooseObjectId(testProductIdString1);
    const testProductId2 = new MongooseObjectId(testProductIdString2);
    const testCart = {
      products: [{ product: testProductId2 }],
    };

    const result = doesCartContainProduct(testCart, testProductId1);

    expect(result).toBe(false);
  });
});

describe("checkForValidQuantity()", () => {
  it("Should throw an error if quantity does not exist", () => {
    const testQuantity = undefined;

    const result = () => checkForValidQuantity(testQuantity);

    expect(result).toThrow(Error);
  });

  it("Should throw an error if quantity is null", () => {
    const testQuantity = null;

    const result = () => checkForValidQuantity(testQuantity);

    expect(result).toThrow(Error);
  });

  it("Should throw an error if quantity is not a valid number representation", () => {
    const invalidQuantity = "NOT A VALID NUMBER";

    const result = () => checkForValidQuantity(invalidQuantity);

    expect(result).toThrow(Error);
  });

  it("Should not throw an error if quantity is a valid number", () => {
    const invalidQuantity = 10;

    const result = () => checkForValidQuantity(invalidQuantity);

    expect(result).not.toThrow(Error);
  });

  it("Should not throw an error if quantity is a valid number representation", () => {
    const invalidQuantity = "10";

    const result = () => checkForValidQuantity(invalidQuantity);

    expect(result).not.toThrow(Error);
  });
});

describe("updateProductQuantity()", () => {
  it("Should update product quantity to new specifed quantity", () => {
    const testProductId = new MongooseObjectId("64a9d3d74ee9a5e73b7ed160");
    const testCart = {
      products: [{ product: testProductId, quantity: 5 }],
    };
    const testNewQuantity = 10;
    const expectedQuantity = 10;

    updateProductQuantity(testCart, testProductId, testNewQuantity);
    const newQuantity = testCart.products[0].quantity;

    expect(newQuantity).toBe(expectedQuantity);
  });
});
