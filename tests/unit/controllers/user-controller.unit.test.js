const { StatusCodes } = require("http-status-codes");

const userController = require("../../../src/controllers/user-controller.js");
const User = require("../../../src/models/user-model.js");

jest.mock("../../../src/models/user-model.js"); // Mock the User model module

describe("getAllUsers()", () => {
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  it("should return an array of users", async () => {
    const mockRequest = {};
    const mockerUser1 = {};
    const mockerUser2 = {};
    const mockUsers = [mockerUser1, mockerUser2];

    User.find.mockResolvedValue(mockUsers);

    await userController.getAllUsers(mockRequest, mockResponse);

    expect.assertions(2);
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({ users: mockUsers });
  });
});

describe("getCurrentUser()", () => {
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  it("should return the current user", async () => {
    const mockRequest = { user: { id: "mockUserId" } };
    const mockUser = {};

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    await userController.getCurrentUser(mockRequest, mockResponse);

    expect.assertions(2);
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({ user: mockUser });
  });
});

describe("getSingleUser()", () => {
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  it("should return the current user", async () => {
    const mockRequest = { params: { userId: "mockUserid" } };
    const mockUser = {};

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    await userController.getSingleUser(mockRequest, mockResponse);

    expect.assertions(2);
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({ user: mockUser });
  });
});

describe("updateUser()", () => {
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  it("should update the email address of a user if a new email addres is provided", async () => {
    const newMockEmail = "newMockEmail@gmail.com";
    const mockRequest = {
      user: { id: "mockUserid" },
      body: {
        email: newMockEmail,
      },
    };
    const mockUpdatedUser = { email: newMockEmail };

    User.findByIdAndUpdate.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUpdatedUser),
    });

    await userController.updateUser(mockRequest, mockResponse);

    expect.assertions(2);
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      user: mockUpdatedUser,
      msg: "Successfully updated user",
    });
  });

  it("should update the name of a user if a new name is provided", async () => {
    const mockNewName = "New Mock Name";
    const mockRequest = {
      user: { id: "mockUserid" },
      body: {
        name: mockNewName,
      },
    };
    const mockUpdatedUser = { name: mockNewName };

    User.findByIdAndUpdate.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUpdatedUser),
    });

    await userController.updateUser(mockRequest, mockResponse);

    expect.assertions(2);
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      user: mockUpdatedUser,
      msg: "Successfully updated user",
    });
  });
});

describe("updateUserPassword()", () => {
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  it("should update the user's if a new password is provided is provided", async () => {
    const newNewPassword = "newNewPassword";
    const mockRequest = {
      user: { id: "mockUserid" },
      body: {
        password: newNewPassword,
      },
    };
    const mockUpdatedUser = {};

    User.findByIdAndUpdate.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUpdatedUser),
    });

    await userController.updateUserPassword(mockRequest, mockResponse);

    expect.assertions(2);
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      user: mockUpdatedUser,
      msg: "Successfully updated user password",
    });
  });

  it("should throw an error if the password is not provided in the reqeust body", () => {
    const newNewPassword = undefined;
    const mockRequest = {
      user: { id: "mockUserid" },
      body: {
        password: newNewPassword,
      },
    };
    const mockUpdatedUser = {};

    User.findByIdAndUpdate.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUpdatedUser),
    });

    expect(
      userController.updateUserPassword(mockRequest, mockResponse)
    ).rejects.toThrowError();
  });
});
