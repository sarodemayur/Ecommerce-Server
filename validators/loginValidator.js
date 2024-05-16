const {z} = require('zod');

const loginSchema = z.object({
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

module.exports = loginSchema;