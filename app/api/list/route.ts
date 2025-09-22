import { getUserFromRequest } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, board_id } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Invalid list title" },
        { status: 409 }
      );
    }

    const board = await prisma.board.findUnique({
      where: { id: board_id },
    });

    const isOwner = board?.ownerId === user.userId;
    if (!board || !isOwner) {
      return NextResponse.json(
        { success: false, error: "Invalid board owner" },
        { status: 409 }
      );
    }

    // Determine next position (max + 1 or 1 if none exist)
    const lastList = await prisma.list.findFirst({
      where: { boardId: board_id },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const nextPosition = lastList ? lastList.position + 1 : 1;

    // Create new list
    const list = await prisma.list.create({
      data: {
        title,
        boardId: board_id,
        position: nextPosition,
      },
      select: {
        id: true,
        title: true,
        boardId: true,
        position: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { data: list },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
