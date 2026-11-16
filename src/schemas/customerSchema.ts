import { z } from "zod";

// Optional fields: an empty input submits "", so allow it explicitly
const optionalEmail = z
  .string()
  .trim()
  .email("Invalid email address")
  .or(z.literal(""))
  .optional();

const optionalTin = z.string().trim().optional();

// Matches CustomerAddDto
export const customerAddSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: optionalEmail,
  phoneNum: z.string().trim().min(7, "Enter a valid phone number"),
  tin: optionalTin,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Matches CustomerModDto (id handled separately)
export const customerModSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: optionalEmail,
  phoneNum: z.string().trim().min(7, "Enter a valid phone number"),
  tin: optionalTin,
});

export const accountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  status: z.enum(["active", "inactive"]),
});

export type CustomerAddFormValues = z.infer<typeof customerAddSchema>;
export type CustomerModFormValues = z.infer<typeof customerModSchema>;
export type AccountFormValues = z.infer<typeof accountSchema>;
