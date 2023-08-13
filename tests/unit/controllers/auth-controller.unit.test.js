const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = require("../../../src/controllers/auth-controller");
const authUtils = require("../../../src/utils/auth-utils");
const User = require("../../../src/models/user-model");

const mockResponse = { json: jest.fn(), status: jest.fn().mockReturnThis() };

jest.mock("bcrypt"); // Mock the bcrypt module
jest.mock("jsonwebtoken"); // Mock the JWT module
jest.mock("../../../src/models/user-model.js"); // Mock the User module
jest.mock("../../../src/utils/auth-utils.js"); // Mock the auth utils module

describe("register()", () => {
  it("should create a new user", async () => {
    const mockUser = {};
    const mockRequest = {
      body: {
        name: "testuser",
        password: "testpass",
        email: "testemail@gmail.com",
      },
    };
    User.create.mockResolvedValue(mockUser); // Mock to a new user from being created
    authUtils.sendConfirmationEmail.mockResolvedValue(); // Mock to prevent email sending functionality

    // Call the function to test
    await authController.register(mockRequest, mockResponse);

    // Assertions
    expect.assertions(3);
    expect(authUtils.sendConfirmationEmail).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(mockResponse.json).toHaveBeenCalledWith({
      msg: "User created successfully",
      user: mockUser,
    });
  });

  it("should throw an error if a 'name' is not provided", () => {
    const mockRequest = {
      body: {
        name: undefined,
        password: "testpass",
        email: "testemail@gmail.com",
      },
    };

    expect(
      authController.register(mockRequest, mockResponse)
    ).rejects.toThrowError();
  });

  it("should throw an error if a 'email' is not provided", () => {
    const mockRequest = {
      body: {
        name: "testuser",
        password: "testpass",
        email: undefined,
      },
    };

    expect(
      authController.register(mockRequest, mockResponse)
    ).rejects.toThrowError();
  });

  it("should throw an error if a 'password' is not provided", () => {
    const mockRequest = {
      body: {
        name: "testuser",
        password: undefined,
        email: "testemail@gmail.com",
      },
    };

    expect(
      authController.register(mockRequest, mockResponse)
    ).rejects.toThrowError();
  });
});

describe("login()", () => {
  it("should return a JWT token if provided valid credentials", async () => {
    const mockRequest = {
      body: {
        password: "testpass",
        email: "testemail@gmail.com",
      },
    };
    const mockUser = {
      password: "mockPassword",
      role: "mockRole",
      _id: "mockId",
    };
    const mockToken = "mockToken";

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compareSync.mockReturnValue(true);
    jwt.sign.mockReturnValue(mockToken);

    // Call the function to test
    await authController.login(mockRequest, mockResponse);

    // Assertions
    expect.assertions(2);
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      msg: "Successfully logged in",
      token: mockToken,
    });
  });

  it("should throw an error if an email is provided that is not associated with a registered user", async () => {
    const mockRequest = {
      body: {
        password: "testpass",
        email: "testemail@gmail.com",
      },
    };
    const mockUser = null; // Indicate no user exists

    User.findOne.mockResolvedValue(mockUser);

    expect(
      authController.login(mockRequest, mockResponse)
    ).rejects.toThrowError();
  });

  it("should throw an error if an email is not provided  in the request", () => {
    const mockRequest = {
      body: {
        password: "testpass",
        email: undefined,
      },
    };

    expect(
      authController.login(mockRequest, mockResponse)
    ).rejects.toThrowError();
  });

  it("should throw an error if a password is not provided  in the request", () => {
    const mockRequest = {
      body: {
        password: undefined,
        email: "testemail@gmail.com",
      },
    };

    expect(
      authController.login(mockRequest, mockResponse)
    ).rejects.toThrowError();
  });

  it("should throw an error if the provided password is incorrect", () => {
    const mockRequest = {
      body: {
        password: "invalidPassword",
        email: "testemail@gmail.com",
      },
    };

    bcrypt.compareSync.mockResolvedValue(false);

    expect(
      authController.login(mockRequest, mockResponse)
    ).rejects.toThrowError();
  });
});

describe("verify()", () => {
  it("should update the users active status if a valid confirmation token is provided", async () => {
    const mockConfirmationToken = "mockConfirmationToken";
    const mockRequest = {
      query: {
        id: mockConfirmationToken,
      },
    };
    const mockUser = {
      emailConfirmationToken: mockConfirmationToken,
      active: false,
      save: jest.fn().mockResolvedValue(),
    };

    User.findOne.mockResolvedValue(mockUser);

    await authController.verify(mockRequest, mockResponse);

    expect.assertions(3);
    expect(mockUser.emailConfirmationToken).toBeUndefined();
    expect(mockUser.active).toBeTruthy();
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "User successfully registered!",
    });
  });

  it("should throw and error if no confirmation token is provided", () => {
    const mockRequest = {
      query: {
        id: null,
      },
    };

    expect.assertions(1);
    expect(
      authController.verify(mockRequest, mockResponse)
    ).rejects.toThrowError();
  });

  it("should throw an error if confirmation token is not associated with a user", () => {
    const mockConfirmationToken = "mockInvalidConfirmationToken";
    const mockRequest = {
      query: {
        id: mockConfirmationToken,
      },
    };

    User.findOne.mockResolvedValue(false);

    expect.assertions(1);
    expect(
      authController.verify(mockRequest, mockResponse)
    ).rejects.toThrowError();
  });
});
