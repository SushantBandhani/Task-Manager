import { z } from "zod";
import loginUserSchema from "./loginUser.validator.ts";

const registerUserSchema = loginUserSchema.extend({
  firstName: z
    .string()
    .trim()
    .min(3, "First name must be at least 3 characters long")
    .max(50, "First name must be at most 50 characters long"),

  lastName: z
    .string()
    .trim()
    .max(50, "Last name must be at most 50 characters long"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export default registerUserSchema;