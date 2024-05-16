const { z } = require("zod");

const signupSchema = z.object({
  username: z
    .string({ required_error: "name is required" })
    .trim()
    .min(3, { message: "Name must be atleast of 3 chars" })
    .max(255, { message: " Name must not have more than 255 characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be atleast of 3 chars" })
    .max(255, { message: " Email must not have more than 255 characters" }),
  password: z
    .string({ required_error: "password is required" })
    .min(7, { message: "password must be atleast of 6 characters" })
    .max(50, "Password can't be greater than 50 characters"),
});

module.exports = signupSchema