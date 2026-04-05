import { z } from "zod";

const loginUserSchema = z.object({
  email: z.email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default loginUserSchema;
