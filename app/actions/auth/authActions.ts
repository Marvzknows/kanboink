"use server";

import {
  signupSchema,
  signInSchema,
  SignInInput,
} from "@/app/schemas/authSchema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";
// Token expiration times
const ACCESS_TOKEN_EXPIRES_IN = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = "7d"; // 7 days

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
      return {
        success: false,
        error: { email: ["Email already in use", "Use different email"] },
      };
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

export async function signinAction(data: SignInInput) {
  try {
    // Validate input data
    const validatedData = signInSchema.parse(data);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isValidPassword) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Generate JWT access token
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_ACCESS_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      {
        userId: user.id,
      },
      JWT_REFRESH_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      }
    );

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Set HTTP-only cookies
    const cookieStore = await cookies();

    // Access token cookie (shorter expiration)
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes in seconds
      path: "/",
    });

    // Refresh token cookie (longer expiration)
    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return {
      success: true,
      message: "Signed in successfully",
      user: {
        id: user.id,
        email: user.email,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  } catch (error) {
    return {
      success: false,
      error: "An error occurred during sign in",
    };
  }
}

export async function refreshAccessToken() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return {
        success: false,
        error: "No refresh token found",
      };
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
      userId: string;
    };

    // Check if refresh token exists in database and is valid
    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return {
        success: false,
        error: "Invalid or expired refresh token",
      };
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        userId: storedToken.user.id,
        email: storedToken.user.email,
      },
      JWT_ACCESS_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      }
    );

    // Set new access token cookie
    cookieStore.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes in seconds
      path: "/",
    });

    return {
      success: true,
      user: storedToken.user,
    };
  } catch (error) {
    console.error("Token refresh error:", error);
    return {
      success: false,
      error: "Failed to refresh token",
    };
  }
}
