import { getUserFromRequest } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Unauthenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { board_id } = body;

    if (!board_id) {
      return NextResponse.json(
        { success: false, error: "Invalid board" },
        { status: 404 }
      );
    }

    const updateUser = await prisma.user.update({
      where: { id: payload.userId },
      data: { activeBoardId: board_id },
      select: { activeBoard: true },
    });

    return NextResponse.json(
      {
        success: true,
        data: updateUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
