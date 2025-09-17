import { getUserFromRequest } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// type GetBoardParamsT = {
//   params: {
//     id: string;
//   };
// };

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const board = await prisma.board.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        owner: {
          select: {
            id: true,
            first_name: true,
            middle_name: true,
            last_name: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            first_name: true,
            middle_name: true,
            last_name: true,
            email: true,
          },
        },
        lists: {
          select: {
            id: true,
            title: true,
            boardId: true,
            cards: {
              select: {
                id: true,
                title: true,
                description: true,
                assigneeId: true,
                listId: true,
                priority: true,
                createdBy: {
                  select: {
                    id: true,
                    first_name: true,
                    middle_name: true,
                    last_name: true,
                    email: true,
                  },
                },
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!board) {
      return NextResponse.json(
        { success: false, error: "Board not found" },
        { status: 404 }
      );
    }

    const isBoardMember = board?.members.some(
      (member) => member.id === user.userId
    );
    const isOwner = board?.owner.id === user.userId;

    if (!isBoardMember && !isOwner) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Not allowed to view this board" },
        { status: 403 }
      );
    }

    const formattedResponse = {
      board: board,
    };

    return NextResponse.json(
      { success: true, data: formattedResponse },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
