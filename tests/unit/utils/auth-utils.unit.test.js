const authUtils = require("../../../src/utils/auth-utils");
const nodemailer = require("nodemailer");
jest.mock("nodemailer");

describe("isSuperuser()", () => {
  it("should return true if user role is admin", () => {
    const userRole = "admin";

    const result = authUtils.isSuperuser(userRole);

    expect(result).toBe(true);
  });

  it("should return false if user role is not admin", () => {
    const userRole = "user";

    const result = authUtils.isSuperuser(userRole);

    expect(result).toBe(false);
  });
});

describe("sendConfirmationEmail()", () => {
  it("should send confirmation email successfully", async () => {
    // Mock the nodemailer transporter and its methods
    const mockSendMail = jest
      .fn()
      .mockResolvedValue({ response: "Mocked response" });
    nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });

    // Call the function
    const email = "test@example.com";
    const queryString = "someQueryString";
    await authUtils.sendConfirmationEmail(email, queryString);

    // Verify that the nodemailer transporter was created with the correct options
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    // Verify that the sendMail method was called with the correct options
    expect(mockSendMail).toHaveBeenCalledWith({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "Verify Your Email Address",
      html: expect.any(String), // You can use expect.any to match the HTML content
    });
  });

  it("should throw an error on email send failure", async () => {
    // Mock the nodemailer transporter and its methods to simulate a failure
    const mockSendMail = jest
      .fn()
      .mockRejectedValue(new Error("Email send failed"));
    nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });

    // Call the function and expect it to throw the expected error
    const email = "test@example.com";
    const queryString = "someQueryString";
    await expect(
      authUtils.sendConfirmationEmail(email, queryString)
    ).rejects.toThrow();
  });
});
