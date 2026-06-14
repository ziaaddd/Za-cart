import { z } from "zod";

const logInSchema = z.object({
  email: z
    .email("Invalid Email Format")
    .min(1, { message: "Email address is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters longs" }),
});

type logInType = z.infer<typeof logInSchema>;

export { logInSchema, type logInType };
