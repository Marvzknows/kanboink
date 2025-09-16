import { getUserFromRequest } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Create List
export const POST = async (req: NextRequest) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get data (title, board_id)
    const body = await req.json();
    const { title, board_id } = body;

    if (!title.trim()) {
      return NextResponse.json(
        { success: false, error: "Invalid list title" },
        { status: 409 }
      );
    }

    // check if the user is the owner of the board
    const board = await prisma.board.findUnique({
      where: {
        id: board_id,
      },
    });

    const isOwner = board?.ownerId === user.userId;

    if (!board || !isOwner) {
      return NextResponse.json(
        { success: false, error: "Invalid board owner" },
        { status: 409 }
      );
    }

    // create list
    const list = await prisma.list.create({
      data: {
        title: title,
        boardId: board_id,
      },
      select: {
        id: true,
        title: true,
        boardId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    //formatted response
    const formattedResponse = {
      data: list,
    };

    return NextResponse.json(
      {
        success: true,
        data: formattedResponse,
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
