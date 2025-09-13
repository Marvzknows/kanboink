import { getUserFromRequest } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Add Member to the Board
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
    const { user_id, board_id } = body;

    // Check if the user already a member of the board
    const board = await prisma.board.findUnique({
      where: {
        id: board_id,
      },
      include: {
        members: true,
      },
    });

    const isAlreadyMember = board?.members.some(
      (member) => member.id === user_id
    );

    if (isAlreadyMember) {
      return NextResponse.json(
        { success: false, error: "User is already a member" },
        { status: 409 }
      );
    }

    const newMember = await prisma.board.update({
      where: {
        id: board_id,
      },
      data: {
        members: {
          connect: { id: user_id },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            first_name: true,
            middle_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });

    const formattedResponse = {
      data: newMember,
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
