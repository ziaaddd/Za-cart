import { z } from "zod";

const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters" }),
  phone: z
    .string()
    .min(10, { message: "Enter a valid phone number" })
    .max(15, { message: "Phone number is too long" })
    .regex(/^\+?[0-9\s\-()]+$/, {
      message: "Phone number contains invalid characters",
    }),
  address: z.string().min(10, { message: "Please enter your full address" }),
  city: z.string().min(2, { message: "City is required" }),
  postalCode: z.string().min(4, { message: "Enter a valid postal code" }),
  notes: z.string().optional(),
});

type TcheckoutForm = z.infer<typeof checkoutSchema>;

export { checkoutSchema, type TcheckoutForm };
