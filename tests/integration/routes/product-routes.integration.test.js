const mongoose = require("mongoose");
const request = require("supertest");
const { StatusCodes } = require("http-status-codes");
const fsPromises = require("node:fs/promises");
const path = require("path");

const app = require("../../../app.js");

let server;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING); // Connect to database
  server = app.listen(process.env.PORT || 3000); // Start the application server
});

afterAll(async () => {
  await mongoose.connection.close(); // Close connection to database
  server.close(); // Stop the server when all tests are done
});

describe("GET Routes", () => {
  describe("GET /products/ - Get all products", () => {
    it("should return all products", async () => {
      const response = await request(app).get("/products/");

      expect.assertions(3);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("count");
      expect(response.body).toHaveProperty("products");
    });
  });

  describe("GET /products/:productId - Get a single product", () => {
    it("should return a single product if provided a valid product ID", async () => {
      const productId = "64a9d3d74ee9a5e73b7ed160";
      const response = await request(app).get(`/products/${productId}`);

      expect.assertions(2);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("product");
    });

    it("should return an 'Bad Request' error message if provided a invalid product ID", async () => {
      const invalidProductId = "64a9d3d74";
      const response = await request(app).get(`/products/${invalidProductId}`);
      const expectErrorMessage = `Invalid product Id: ${invalidProductId}`;

      expect.assertions(3);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty("errorMsg");
      expect(response.body.errorMsg).toBe(expectErrorMessage);
    });

    it("should return a 'Not Found' error message if provided a invalid yet properly constructed product ID", async () => {
      const invalidProductId = "64a9d3d74ee9a5e73b7ed325";
      const response = await request(app).get(`/products/${invalidProductId}`);
      const expectErrorMessage = `Product with ${invalidProductId} does not exist`;

      expect.assertions(3);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty("errorMsg");
      expect(response.body.errorMsg).toBe(expectErrorMessage);
    });
  });

  describe("GET /products/:productId/reviews - Get all reviews for a product", () => {
    it("should return all reviews associated with a product", async () => {
      const productId = "64a9d3d74ee9a5e73b7ed160";

      const response = await request(app).get(`/products/${productId}/reviews`);

      expect.assertions(3);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("count");
      expect(response.body).toHaveProperty("reviews");
    });

    it("should throw an error if provided an invalid product ID", async () => {
      const invalidProductId = "1234";
      const expectedErrorMsg = `Invalid product id: ${invalidProductId}`;

      const response = await request(app).get(
        `/products/${invalidProductId}/reviews`
      );

      expect.assertions(3);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty("errorMsg");
      expect(response.body.errorMsg).toBe(expectedErrorMsg);
    });

    it("should throw an error if provided an invalid product ID with correct ID syntax", async () => {
      const invalidProductId = "64a9d3d74ee9a5e73b7ed456";
      const expectedErrorMsg = `No product exists with id: ${invalidProductId}`;

      const response = await request(app).get(
        `/products/${invalidProductId}/reviews`
      );

      expect.assertions(3);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty("errorMsg");
      expect(response.body.errorMsg).toBe(expectedErrorMsg);
    });
  });
});

describe("POST Routes", () => {
  let JsonWebToken;

  beforeAll(async () => {
    const response = await request(app)
      .post("/auth/login")
      .set("Content-Type", "application/json")
      .send({ email: "email@gmail.com", password: "password" });

    JsonWebToken = response.body.token;
  });

  describe("POST /products/ - Create a product", () => {
    it("should create a product when provided a valid input body", async () => {
      const requestBody = {
        name: "mock name",
        price: 25999,
        image: "mock image URL",
        company: "Amazon", // Must be one of ["West Elm", "Maiden Home", "Burrow", "Wayfair", "Amazon", "Etsy"]
        description: "mock description",
        category: "office", // Must be one of ["office", "kitchen", "bedroom"]
        user: "647bd81c4c68806d09c6e8c4",
      };

      const response = await request(app)
        .post("/products/")
        .set("Authorization", `Bearer ${JsonWebToken}`)
        .set("Content-Type", "application/json")
        .send(requestBody);

      expect.assertions(2);
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toHaveProperty("product");
    });

    it("should not create a product if missing required input", async () => {
      const requestBody = {
        name: undefined,
        price: undefined,
        user: "647bd81c4c68806d09c6e8c4",
      };

      const response = await request(app)
        .post("/products/")
        .set("Authorization", `Bearer ${JsonWebToken}`)
        .set("Content-Type", "application/json")
        .send(requestBody);

      expect.assertions(2);
      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body).toHaveProperty("errorMsg");
    });
  });

  describe("POST /products/:productId/image - Upload a product image", () => {
    const imageDir =
      "/Users/mebrahim/Documents/e-commercie-api-practice/src/uploads/";
    let fileToDeletePath = null;

    afterEach(async () => {
      await fsPromises.rm(fileToDeletePath); // Removes image that is uploaded to local memory
    });

    it("should upload an image associated with a product", async () => {
      const productId = "64decab12d206b1b37197e1f";
      const expectedMsg = "Successfully uploaded image";

      const response = await request(app)
        .post(`/products/${productId}/image`)
        .set("Authorization", `Bearer ${JsonWebToken}`)
        .attach("image", `${imageDir}/image-1686111722865.png`);

      fileToDeletePath = `${imageDir}/${path.basename(
        response.body.imagePath
      )}`;

      expect.assertions(3);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("imagePath");
      expect(response.body.msg).toBe(expectedMsg);
    });
  });
});

describe("PATCH Routes", () => {
  let JsonWebToken;

  beforeAll(async () => {
    const response = await request(app)
      .post("/auth/login")
      .set("Content-Type", "application/json")
      .send({ email: "email@gmail.com", password: "password" });

    JsonWebToken = response.body.token;
  });

  describe("PATCH /products/:productId - Update a product", () => {
    it("should update a product details", async () => {
      const productId = "64decab12d206b1b37197e1f";
      const requestBody = {
        name: "new mock name",
        price: 100,
      };

      const response = await request(app)
        .patch(`/products/${productId}`)
        .set("Authorization", `Bearer ${JsonWebToken}`)
        .set("Content-Type", "application/json")
        .send(requestBody);

      expect.assertions(5);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.product).toHaveProperty("name");
      expect(response.body.product).toHaveProperty("price");
      expect(response.body.product.name).toBe("new mock name");
      expect(response.body.product.price).toBe(100);
    });
  });
});

describe("DELETE Routes", () => {
  let JsonWebToken;
  let productToDeleteId;

  beforeAll(async () => {
    const authResponse = await request(app)
      .post("/auth/login")
      .set("Content-Type", "application/json")
      .send({ email: "email@gmail.com", password: "password" });

    JsonWebToken = authResponse.body.token;
  });

  beforeEach(async () => {
    const requestBody = {
      name: "mock name",
      price: 25999,
      image: "mock image URL",
      company: "Amazon",
      description: "mock description",
      category: "office",
      user: "647bd81c4c68806d09c6e8c4",
    };

    const createProductResponse = await request(app)
      .post("/products/")
      .set("Authorization", `Bearer ${JsonWebToken}`)
      .set("Content-Type", "application/json")
      .send(requestBody);

    productToDeleteId = createProductResponse.body.product._id;
  });

  describe("DELETE /products/:productId - Delete a product", () => {
    it("should delete a product if it exists", async () => {
      const expectedMsg = `Product with id "${productToDeleteId}" successfully deleted`;

      const response = await request(app)
        .delete(`/products/${productToDeleteId}`)
        .set("Authorization", `Bearer ${JsonWebToken}`);

      expect.assertions(3);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("msg");
      expect(response.body.msg).toBe(expectedMsg);
    });

    it("should throw an error if an invalid ID is provided", async () => {
      const invalidProductId = "12345";
      const expectedErrorMsg = `Invalid product Id: ${invalidProductId}`;

      const response = await request(app)
        .delete(`/products/${invalidProductId}`)
        .set("Authorization", `Bearer ${JsonWebToken}`);

      expect.assertions(3);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty("errorMsg");
      expect(response.body.errorMsg).toBe(expectedErrorMsg);
    });
  });
});
