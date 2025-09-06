import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

type JWTPayload = {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
};

export const GET = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("access_token")?.value || null;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "No token provided, Unauthenticated",
        },
        { status: 401 }
      );
    }

    //verify token
    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
    if (!JWT_ACCESS_SECRET) {
      return NextResponse.json({
        success: false,
        error: "Server configuration error",
      });
    }

    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, JWT_ACCESS_SECRET) as JWTPayload;
    } catch (jwtError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token",
          message: "Unauthenticated.",
        },
        { status: 401 }
      );
    }

    // find user in database
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        first_name: true,
        middle_name: true,
        last_name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        ownedBoards: true,
        boards: true,
        activities: true,
        cards: true,
        comments: true,
        _count: {
          select: {
            ownedBoards: true,
            boards: true,
            cards: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      });
    }

    const userData = {
      id: user.id,
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      full_name: `${user.first_name} ${user.middle_name || ""} ${
        user.last_name
      }`
        .trim()
        .replace(/\s+/g, " "),
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      ownedBoards: user.ownedBoards,
      memberBoards: user.boards,
      stats: {
        ownedBoardsCount: user._count.ownedBoards,
        memberBoardsCount: user._count.boards,
        cardsCount: user._count.cards,
        commentsCount: user._count.comments,
      },
    };

    return NextResponse.json(
      { success: true, data: userData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
