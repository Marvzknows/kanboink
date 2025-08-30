"use server";

import { signupSchema } from "@/app/schemas/authSchema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function signupAction(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());

    const parsed = signupSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.flatten,
      };
    }

    const { first_name, middle_name, last_name, email, password } = parsed.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: { email: ["Email already in use"] } };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        first_name,
        middle_name,
        last_name,
        email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "Account successfully created",
    };
  } catch (err) {
    return { success: false, error: { general: ["Something went wrong"] } };
  }
}
