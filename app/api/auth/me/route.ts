import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/jwt";

export const GET = async (req: NextRequest) => {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Unauthenticated" },
        { status: 401 }
      );
    }
    // find user in database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        first_name: true,
        middle_name: true,
        last_name: true,
        email: true,
        activeBoard: {
          select: {
            id: true,
            title: true,
            ownerId: true,
            owner: true,
          },
        },
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
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // construct response
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
      activeBoard: user.activeBoard,
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
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
