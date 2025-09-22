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
    const { title, description, assigneeId, listId, priority } = body;

    if (!title || !listId || !priority) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if list exists
    const list = await prisma.list.findUnique({
      where: { id: listId },
      select: { id: true, boardId: true },
    });

    if (!list) {
      return NextResponse.json(
        { success: false, error: "List not found" },
        { status: 404 }
      );
    }

    // Get last card's position (efficient)
    const lastCard = await prisma.card.findFirst({
      where: { listId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const cardPosition = lastCard ? lastCard.position + 1 : 1;

    // Create card
    const card = await prisma.card.create({
      data: {
        title,
        description,
        assigneeId: assigneeId || null,
        listId,
        priority,
        position: cardPosition,
        createdById: user.userId,
      },
      include: {
        user: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
        createdBy: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
        list: { select: { id: true, title: true } },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: "CARD_CREATED",
        userId: user.userId,
        boardId: list.boardId,
        details: {
          cardId: card.id,
          title: card.title,
        },
      },
    });

    return NextResponse.json({ success: true, data: card }, { status: 201 });
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
