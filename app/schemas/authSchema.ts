import { z } from "zod";

export const signupSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email().min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signInSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(1, "Passowrd is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
